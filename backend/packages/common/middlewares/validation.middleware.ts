import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { ApiError } from "../utils/apiError.js";


export interface IRequestValidators {
    body?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
}


export const validate =
    (schemas: IRequestValidators) =>
        async (
            req: Request,
            _res: Response,
            next: NextFunction
        ): Promise<void> => {
            try {
                // 1. Validate request body against schema if provided
                if (schemas.body) {
                    req.body = await schemas.body.parseAsync(req.body);
                }

                // 2. Validate URL query string variables if provided
                if (schemas.query) {
                    req.query = await schemas.query.parseAsync(req.query) as any;
                }

                // 3. Validate URL structural path parameters if provided
                if (schemas.params) {
                    req.params = await schemas.params.parseAsync(req.params) as any;
                }

                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    const firstIssue = error.issues[0];
                    const fieldName = firstIssue?.path.join(".") || "Field";
                    const detailedMessage = firstIssue
                        ? `${fieldName}: ${firstIssue.message}`
                        : "Validation failed";

                    return next(new ApiError(400, detailedMessage));
                }

                next(error);
            }
        };
