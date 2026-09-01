import type {
    Request,
    Response,
    NextFunction,
} from "express";

import redis from "../config/redis.js";
import env from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

const rateLimit = (
    keyPrefix = "global"
) => {
    return async (
        req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const client = redis.getClient();

            const identifier =
                req.ip ||
                req.socket.remoteAddress ||
                "unknown";

            const key =
                `rate-limit:${keyPrefix}:${identifier}`;

            const count =
                await client.incr(key);

            if (count === 1) {
                await client.expire(
                    key,
                    env.rateLimit.windowSeconds
                );
            }

            if (
                count >
                env.rateLimit.maxRequests
            ) {
                const ttl =
                    await client.ttl(key);

                throw new ApiError(
                    429,
                    `Too many requests. Try again in ${Math.max(
                        ttl,
                        0
                    )} seconds.`
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default rateLimit;