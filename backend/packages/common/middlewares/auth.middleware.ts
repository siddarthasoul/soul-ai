import type {
    Request,
    Response,
    NextFunction,
} from "express";

import { ApiError } from "../utils/apiError.js";

export function requireAuthMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    const userId = req.identity?.userId;

    if (!userId) {
        return next(
            new ApiError(
                401,
                "Authentication required"
            )
        );
    }

    return next();
}