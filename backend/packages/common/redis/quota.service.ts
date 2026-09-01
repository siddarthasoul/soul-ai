import redis from "../config/redis.js";

export interface QuotaCheckResult {
    allowed: boolean;
    used: number;
    remaining: number;
    limit: number;
    resetAt: number;
}

class QuotaService {
    /**
     * Consume one unit from a quota.
     *
     * Example:
     *
     * guest:chat:123
     * limit = 5
     * window = 24 hours
     *
     * The quota automatically resets when
     * the Redis key expires.
     */
    async consume(
        key: string,
        limit: number,
        windowSeconds: number
    ): Promise<QuotaCheckResult> {
        if (limit <= 0) {
            throw new Error(
                "Quota limit must be greater than zero"
            );
        }

        if (windowSeconds <= 0) {
            throw new Error(
                "Quota window must be greater than zero"
            );
        }

        const client = redis.getClient();

        const current = await client.incr(key);

        /**
         * Set expiration only when this is
         * the first request in the window.
         */
        if (current === 1) {
            await client.expire(
                key,
                windowSeconds
            );
        }

        const ttl = await client.ttl(key);

        const resetAt =
            Date.now() +
            Math.max(ttl, 0) * 1000;

        const allowed =
            current <= limit;

        const remaining = Math.max(
            limit - current,
            0
        );

        return {
            allowed,
            used: current,
            remaining,
            limit,
            resetAt,
        };
    }

    /**
     * Read the current quota without consuming it.
     */
    async get(
        key: string,
        limit: number
    ): Promise<QuotaCheckResult> {
        const client = redis.getClient();

        const value =
            await client.get(key);

        const used =
            value ? Number(value) : 0;

        const ttl =
            await client.ttl(key);

        return {
            allowed: used < limit,
            used,
            remaining: Math.max(
                limit - used,
                0
            ),
            limit,
            resetAt:
                ttl > 0
                    ? Date.now() + ttl * 1000
                    : 0,
        };
    }

    /**
     * Remove a quota manually.
     *
     * Useful for testing or admin operations.
     */
    async reset(
        key: string
    ): Promise<void> {
        const client = redis.getClient();

        await client.del(key);
    }
}

const quotaService =
    new QuotaService();

export default quotaService;