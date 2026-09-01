
import rateLimitService, {
    type RateLimitResult,
} from "../../../../packages/common/redis/rate-limit.service.js";

import env from "../../../../packages/common/config/env.js";

import { ApiError } from "../../../../packages/common/utils/apiError.js";

import type {
    ChatIdentity,
} from "../../../../packages/common/middlewares/identity.middleware.js";

class ChatRateLimitService {

    // ==========================================================
    // CHECK + CONSUME
    // ==========================================================

    /**
     * Consume ONE chat request.
     *
     * Use this when the user actually sends
     * a message.
     */
    async check(
        identity: ChatIdentity
    ): Promise<RateLimitResult> {

        if (identity.userId) {
            return rateLimitService.check({
                key: "chat:user",
                identifier: identity.userId,
                limit:
                    env.chatRateLimit.user.limit,
                windowSeconds:
                    env.chatRateLimit.user.windowSeconds,
            });
        }

        if (identity.guestId) {
            return rateLimitService.check({
                key: "chat:guest",
                identifier: identity.guestId,
                limit:
                    env.chatRateLimit.guest.limit,
                windowSeconds:
                    env.chatRateLimit.guest.windowSeconds,
            });
        }

        throw new ApiError(
            401,
            "Identity required for chat rate limiting"
        );
    }

    // ==========================================================
    // GET STATUS - NO CONSUME
    // ==========================================================

    /**
     * Read the current chat limit.
     *
     * IMPORTANT:
     *
     * This does NOT consume a request.
     *
     * Use this when:
     *
     * - creating a conversation
     * - opening ChatPage
     * - refreshing ChatPage
     * - checking whether input should be enabled
     */
    async getStatus(
        identity: ChatIdentity
    ): Promise<RateLimitResult> {

        if (identity.userId) {
            return rateLimitService.getStatus({
                key: "chat:user",
                identifier: identity.userId,
                limit:
                    env.chatRateLimit.user.limit,
                windowSeconds:
                    env.chatRateLimit.user.windowSeconds,
            });
        }

        if (identity.guestId) {
            return rateLimitService.getStatus({
                key: "chat:guest",
                identifier: identity.guestId,
                limit:
                    env.chatRateLimit.guest.limit,
                windowSeconds:
                    env.chatRateLimit.guest.windowSeconds,
            });
        }

        throw new ApiError(
            401,
            "Identity required for chat rate limiting"
        );
    }

    // ==========================================================
    // ENFORCE
    // ==========================================================

    /**
     * Consume ONE request and reject when
     * the limit has already been reached.
     *
     * Use this only for message sending.
     */
    async enforce(
        identity: ChatIdentity
    ): Promise<RateLimitResult> {

        const result =
            await this.check(identity);

        if (!result.allowed) {
            throw new ApiError(
                429,
                `Too many requests. Try again in ${result.retryAfterSeconds} seconds.`
            );
        }

        return result;
    }
}

const chatRateLimitService =
    new ChatRateLimitService();

export default chatRateLimitService;
