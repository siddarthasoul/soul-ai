import type { Request, Response } from "express";

import authService from "../services/auth.service.js";

import env from "../../../../packages/common/config/env.js";

import { ApiResponse } from "../../../../packages/common/utils/apiResponse.js";

export class AuthController {
    async requestLoginOtp(
        req: Request,
        res: Response
    ) {

        await authService.requestLoginOtp(
            req.body.email
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                "OTP sent successfully",
                null
            )
        );

    }

    async verifyLoginOtp(
        req: Request,
        res: Response
    ) {

        const result =
            await authService.verifyLoginOtp(
                req.body.email,
                req.body.otp
            );

        // ------------------------------------------
        // CREATE LOGGED-IN USER SESSION
        // ------------------------------------------

        res.cookie(
            "sessionId",
            result.sessionId,
            {
                httpOnly: true,
                secure: env.session.secure,
                sameSite: "lax",
                maxAge:
                    env.auth.session.ttlSeconds *
                    1000,
                path: "/",
            }
        );

        // ------------------------------------------
        // REMOVE OLD GUEST IDENTITY
        // ------------------------------------------

        res.clearCookie(
            "guestId",
            {
                httpOnly: true,
                secure: env.session.secure,
                sameSite: "lax",
                path: "/",
            }
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Login successful",
                result.user
            )
        );

    }

}

const authController =
    new AuthController();

export default authController;
