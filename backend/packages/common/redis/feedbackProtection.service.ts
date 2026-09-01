import redis from "../config/redis.js";

import env from "../config/env.js";

import { ApiError } from "../utils/apiError.js";

class FeedbackProtectionService {

    private normalizeUserId(
        userId: string
    ): string {
        return userId.trim();
    }

    private getRequestKey(
        userId: string
    ): string {
        return `feedback:request:${this.normalizeUserId(
            userId
        )}`;
    }

    async checkRequest(
        userId: string
    ): Promise<void> {

        const client =
            redis.getClient();

        const requestKey =
            this.getRequestKey(userId);

        const count =
            await client.incr(requestKey);

        /*
         * Start the 24-hour window
         * on the first request.
         */
        if (count === 1) {
            await client.expire(
                requestKey,
                env.feedback
                    .requestWindowSeconds
            );
        }

        console.log("[FeedbackProtection]", {
            requestKey,
            count,
            requestLimit: env.feedback.requestLimit,
            windowSeconds:
                env.feedback.requestWindowSeconds,
        });

        /*
         * Maximum feedback submissions
         * allowed in the window.
         */
        if (
            count >
            env.feedback.requestLimit
        ) {
            const ttl =
                await client.ttl(
                    requestKey
                );

            throw new ApiError(
                429,
                `Too many feedback submissions. Try again in ${Math.max(
                    ttl,
                    0
                )} seconds.`
            );
        }
    }
}

const feedbackProtectionService =
    new FeedbackProtectionService();

export default feedbackProtectionService;