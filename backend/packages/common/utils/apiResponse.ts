import type { Response } from "express";

export class ApiResponse<T> {
    public readonly success: boolean = true;

    constructor(
        public readonly statusCode: number,
        public readonly message: string,
        public readonly data: T
    ) { }

    /**
     * Standard 200 OK Response
     */
    static success<T>(
        res: Response,
        data: T,
        message = "Success",
        statusCode = 200 // Made dynamic with a fallback to 200
    ): Response {
        return res.status(statusCode).json(
            new ApiResponse<T>(
                statusCode,
                message,
                data
            )
        );
    }

    /**
     * Standard 201 Resource Created Response
     */
    static created<T>(
        res: Response,
        data: T,
        message = "Created"
    ): Response {
        return res.status(201).json(
            new ApiResponse<T>(
                201,
                message,
                data
            )
        );
    }

    /**
     * Standard 204 No Content Response (e.g., after successful deletion)
     */
    static noContent(
        res: Response
    ): Response {
        return res.status(204).send();
    }
}
