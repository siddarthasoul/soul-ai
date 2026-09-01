import redis from "../config/redis.js";
import { ApiError } from "../utils/apiError.js";

interface OtpRateLimitResult {
    allowed: boolean;
    count: number;
    remaining: number;
    retryAfterSeconds: number;
}

class OtpRateLimitService {
    private readonly REQUEST_LIMIT = 3;
    private readonly WINDOW_SECONDS = 60 * 60;

    async check(
        email: string
    ): Promise<OtpRateLimitResult> {
        const client = redis.getClient();

        const normalizedEmail =
            email.trim().toLowerCase();

        const key =
            `auth:otp:request:${normalizedEmail}`;

        const count =
            await client.incr(key);

        if (count === 1) {
            await client.expire(
                key,
                this.WINDOW_SECONDS
            );
        }

        const ttl =
            await client.ttl(key);

        const remaining =
            Math.max(
                this.REQUEST_LIMIT - count,
                0
            );

        if (
            count >
            this.REQUEST_LIMIT
        ) {
            return {
                allowed: false,
                count,
                remaining: 0,
                retryAfterSeconds:
                    Math.max(ttl, 0),
            };
        }

        return {
            allowed: true,
            count,
            remaining,
            retryAfterSeconds: 0,
        };
    }

    async enforce(
        email: string
    ): Promise<void> {
        const result =
            await this.check(email);

        if (!result.allowed) {
            throw new ApiError(
                429,
                `Too many OTP requests. Try again in ${result.retryAfterSeconds} seconds.`
            );
        }
    }

    async reset(
        email: string
    ): Promise<void> {
        const client = redis.getClient();

        const normalizedEmail =
            email.trim().toLowerCase();

        await client.del(
            `auth:otp:request:${normalizedEmail}`
        );
    }
}

const otpRateLimitService =
    new OtpRateLimitService();

export default otpRateLimitService;