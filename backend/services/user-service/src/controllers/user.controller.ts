import type { Request, Response } from "express";

import userService from "../services/user.service.js";
import verificationService from "../services/verification.service.js";
import env from "../../../../packages/common/config/env.js";
import { ApiResponse } from "../../../../packages/common/utils/apiResponse.js";

export class UserController {

    async createUser(
        req: Request,
        res: Response
    ) {
        const result =
            await userService.createUser(req.body);

        return res.status(201).json(
            new ApiResponse(
                201,
                "Registration successful",
                result
            )
        );
    }


    async verifyEmailAndSubscribe(
        req: Request,
        res: Response
    ) {
        const result =
            await verificationService.verifyEmailAndSubscribe(
                req.body
            );

        // --------------------------------------------------
        // CREATE AUTH SESSION
        // --------------------------------------------------

        res.cookie("sessionId", result.sessionId, {
            httpOnly: true,
            secure: env.session.secure,
            sameSite: "none",
            maxAge:
                env.auth.session.ttlSeconds * 1000,
            path: "/",
        });

        // --------------------------------------------------
        // REMOVE GUEST ID
        // --------------------------------------------------
        // User is now authenticated, so the guest identity
        // should no longer remain in the browser.

        res.clearCookie("guestId", {
            httpOnly: true,
            secure: env.session.secure,
            sameSite: "none",
            path: "/",
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                "Email verified successfully",
                result.user
            )
        );
    }




    async resendVerificationOtp(
        req: Request,
        res: Response
    ) {
        await verificationService.generateAndSaveOtp(
            req.body.email
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Verification code sent successfully",
                null
            )
        );
    }
}

const userController = new UserController();

export default userController;