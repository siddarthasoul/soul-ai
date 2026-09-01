import redis from "../config/redis.js";
import env from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

class OtpProtectionService {
    private normalizeEmail(
        email: string
    ): string {
        return email
            .trim()
            .toLowerCase();
    }

    private getRequestKey(
        email: string
    ): string {
        return `auth:otp:request:${this.normalizeEmail(email)}`;
    }

    private getCooldownKey(
        email: string
    ): string {
        return `auth:otp:cooldown:${this.normalizeEmail(email)}`;
    }

    private getAttemptKey(
        email: string
    ): string {
        return `auth:otp:attempt:${this.normalizeEmail(email)}`;
    }

    async checkRequest(
        email: string
    ): Promise<void> {
        const client =
            redis.getClient();

        const cooldownKey =
            this.getCooldownKey(email);

        const cooldown =
            await client.ttl(
                cooldownKey
            );

        if (cooldown > 0) {
            throw new ApiError(
                429,
                `Please wait ${cooldown} seconds before requesting another OTP.`
            );
        }

        const requestKey =
            this.getRequestKey(email);

        const count =
            await client.incr(
                requestKey
            );

        if (count === 1) {
            await client.expire(
                requestKey,
                env.otp
                    .requestWindowSeconds
            );
        }

        if (
            count >
            env.otp.requestLimit
        ) {
            const ttl =
                await client.ttl(
                    requestKey
                );

            throw new ApiError(
                429,
                `Too many OTP requests. Try again in ${Math.max(
                    ttl,
                    0
                )} seconds.`
            );
        }

        await client.set(
            cooldownKey,
            "1",
            {
                EX:
                    env.otp
                        .requestCooldownSeconds,
            }
        );
    }

    async checkAttempt(
        email: string
    ): Promise<void> {
        const client =
            redis.getClient();

        const key =
            this.getAttemptKey(
                email
            );

        const attempts =
            await client.incr(key);

        if (attempts === 1) {
            await client.expire(
                key,
                env.auth.otp.ttlSeconds
            );
        }

        if (
            attempts >
            env.otp
                .verifyAttemptLimit
        ) {
            throw new ApiError(
                429,
                "Too many invalid OTP attempts. Please request a new OTP."
            );
        }
    }

    async resetAttempts(
        email: string
    ): Promise<void> {
        const client =
            redis.getClient();

        await client.del(
            this.getAttemptKey(
                email
            )
        );
    }
}

const otpProtectionService =
    new OtpProtectionService();

export default otpProtectionService;