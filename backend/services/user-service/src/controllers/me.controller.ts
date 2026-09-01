import type {
    Request,
    Response,
} from "express";

import meService from "../services/me.service.js";
import { ApiResponse } from "../../../../packages/common/utils/apiResponse.js";
import { ApiError } from "../../../../packages/common/utils/apiError.js";

class Me {

    async me(
        req: Request,
        res: Response
    ): Promise<Response> {

        console.log("[ME] cookies:", req.cookies);
        console.log(
            "[ME] sessionId:",
            req.cookies?.sessionId
        );

        const sessionId =
            req.cookies?.sessionId;

        if (!sessionId) {
            throw new ApiError(
                401,
                "Not authenticated"
            );
        }

        const user =
            await meService.getCurrentUser(
                sessionId
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Current user",
                user
            )
        );
    }
}

const me =
    new Me();

export default me;