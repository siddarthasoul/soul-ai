import type {
    Request,
    Response,
    NextFunction,
} from "express";

import { randomUUID } from "node:crypto";

import sessionRepository
    from "../../../services/user-service/src/repositories/session.repository.js";

import { ApiError } from "../utils/apiError.js";

export interface ChatIdentity {
    userId?: string;
    guestId?: string;
}

declare global {
    namespace Express {
        interface Request {
            identity?: ChatIdentity;
        }
    }
}



export async function identityMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const sessionId = req.cookies?.sessionId;

        console.log(
            "[Identity] sessionId:",
            sessionId
        );

        // =========================
        // LOGGED-IN USER
        // =========================

        if (sessionId) {
            const userId =
                await sessionRepository.getUserId(
                    sessionId
                );

            console.log(
                "[Identity] userId:",
                userId
            );

            if (userId) {
                console.log(
                    "[Identity] USER AUTHENTICATED"
                );

                req.identity = {
                    userId,
                };

                next();
                return;
            }

            // Session exists but is invalid/expired
            console.log(
                "[Identity] INVALID SESSION"
            );

            res.clearCookie("sessionId", {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV ===
                    "production",
                sameSite: "lax",
                path: "/",
            });
        }

        // =========================
        // GUEST USER
        // =========================
        if (req.identity?.guestId) {
            next();
            return;
        }

        let guestId =
            req.cookies?.guestId;

        if (!guestId) {
            guestId = randomUUID();

            console.log(
                "[Identity] NEW GUEST:",
                guestId
            );

            res.cookie("guestId", guestId, {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV ===
                    "production",
                sameSite: "lax",
                maxAge:
                    30 *
                    24 *
                    60 *
                    60 *
                    1000,
                path: "/",
            });
        } else {
            console.log(
                "[Identity] EXISTING GUEST:",
                guestId
            );
        }

        req.identity = {
            guestId,
        };

        next();
    } catch (error) {
        next(error);
    }
}