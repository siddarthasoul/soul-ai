
import redis from "../config/redis.js";

import { ApiError } from "../utils/apiError.js";

export interface RateLimitOptions {
    key: string;
    identifier: string;
    limit: number;
    windowSeconds: number;
}

export interface RateLimitResult {
    allowed: boolean;
    limit: number;
    remaining: number;
    retryAfterSeconds: number;
}

class RateLimitService {
    private readonly prefix = "rate_limit";

    // ==========================================================
    // CHECK + CONSUME
    // ==========================================================

    /**
     * Consumes ONE request from the rate-limit bucket.
     *
     * Use this when the user actually sends a chat message.
     */
    async check(
        options: RateLimitOptions
    ): Promise<RateLimitResult> {
        const {
            key,
            identifier,
            limit,
            windowSeconds,
        } = options;

        this.validateOptions(options);

        const redisClient =
            redis.getClient();

        const redisKey =
            `${this.prefix}:${key}:${identifier}`;

        const count =
            await redisClient.incr(redisKey);

        // Start the fixed window only on the first request.
        if (count === 1) {
            await redisClient.expire(
                redisKey,
                windowSeconds
            );
        }

        const ttl =
            await redisClient.ttl(redisKey);

        const allowed =
            count <= limit;

        const remaining =
            Math.max(
                0,
                limit - count
            );

        return {
            allowed,
            limit,
            remaining,
            retryAfterSeconds:
                remaining === 0
                    ? Math.max(0, ttl)
                    : 0,
        };
    }

    // ==========================================================
    // ENFORCE
    // ==========================================================

    /**
     * Consumes one request and throws 429
     * when the request is not allowed.
     *
     * Use this only when you want the backend
     * to immediately reject the request.
     */
    async enforce(
        options: RateLimitOptions
    ): Promise<RateLimitResult> {
        const result =
            await this.check(options);

        if (!result.allowed) {
            throw new ApiError(
                429,
                `Too many requests. Try again in ${result.retryAfterSeconds} seconds.`
            );
        }

        return result;
    }

    // ==========================================================
    // GET STATUS - DOES NOT CONSUME
    // ==========================================================

    /**
     * Reads the current rate-limit status.
     *
     * IMPORTANT:
     *
     * This DOES NOT increment Redis.
     *
     * Use this when:
     *
     * - opening a chat
     * - refreshing ChatPage
     * - checking whether input should be enabled
     */
    async getStatus(
        options: RateLimitOptions
    ): Promise<RateLimitResult> {
        const {
            key,
            identifier,
            limit,
            windowSeconds,
        } = options;

        this.validateOptions(options);

        const redisClient =
            redis.getClient();

        const redisKey =
            `${this.prefix}:${key}:${identifier}`;

        const value =
            await redisClient.get(redisKey);

        const count =
            Number(value) || 0;

        const ttl =
            await redisClient.ttl(redisKey);

        const remaining =
            Math.max(
                0,
                limit - count
            );

        const allowed =
            remaining > 0;

        return {
            allowed,
            limit,
            remaining,
            retryAfterSeconds:
                remaining === 0
                    ? Math.max(0, ttl)
                    : 0,
        };
    }

    // ==========================================================
    // RESET
    // ==========================================================

    async reset(
        key: string,
        identifier: string
    ): Promise<void> {
        const redisClient =
            redis.getClient();

        const redisKey =
            `${this.prefix}:${key}:${identifier}`;

        await redisClient.del(redisKey);
    }

    // ==========================================================
    // VALIDATION
    // ==========================================================

    private validateOptions(
        options: RateLimitOptions
    ): void {
        const {
            identifier,
            limit,
            windowSeconds,
        } = options;

        if (!identifier) {
            throw new ApiError(
                400,
                "Rate limit identifier is required"
            );
        }

        if (limit <= 0) {
            throw new ApiError(
                500,
                "Rate limit must be greater than zero"
            );
        }

        if (windowSeconds <= 0) {
            throw new ApiError(
                500,
                "Rate limit window must be greater than zero"
            );
        }
    }
}

const rateLimitService =
    new RateLimitService();

export default rateLimitService;
