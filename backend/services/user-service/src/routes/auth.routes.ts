import { Router } from "express";

import authController from "../controllers/auth.controller.js";

import { asyncHandler } from "../../../../packages/common/utils/asyncHandler.js";

import { validate } from "../../../../packages/common/middlewares/validation.middleware.js";

import {
    requestLoginOtpSchema,
    verifyLoginOtpSchema,
} from "../validation/auth.validation.js";

const router = Router();

router.post(
    "/request-otp",

    validate({
        body: requestLoginOtpSchema,
    }),

    asyncHandler(
        authController.requestLoginOtp.bind(
            authController
        )
    )
);

router.post(
    "/verify-otp",

    validate({
        body: verifyLoginOtpSchema,
    }),

    asyncHandler(
        authController.verifyLoginOtp.bind(
            authController
        )
    )
);

export default router;