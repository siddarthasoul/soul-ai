import type {
    Request,
    Response,
    NextFunction,
} from "express";

import { ApiError } from "../utils/apiError.js";
import logger from "../utils/logger.js";

export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    let statusCode = 500;
    let message = "Internal server error";

    if (error instanceof ApiError) {
        statusCode = error.statusCode;
        message = error.message;
    } else if (error instanceof Error) {
        message = error.message;
    }

    logger.error("Request error", {
        method: req.method,
        url: req.originalUrl,
        statusCode,
        error: error instanceof Error
            ? error.stack
            : error,
    });

    return res.status(statusCode).json({
        success: false,
        message,
    });
}