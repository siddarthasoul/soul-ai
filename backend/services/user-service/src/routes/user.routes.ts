import { Router } from "express";

import userController from "../controllers/user.controller.js";
import me from "../controllers/me.controller.js";

import {
    asyncHandler,
} from "../../../../packages/common/utils/asyncHandler.js";

import {
    validate,
} from "../../../../packages/common/middlewares/validation.middleware.js";

import {
    createUserSchema,
    verifyEmailSchema,
    resendVerificationOtpSchema,
} from "../validation/user.validation.js";

const router = Router();

router.post(
    "/",
    validate({
        body: createUserSchema,
    }),
    asyncHandler(
        userController.createUser.bind(
            userController
        )
    )
);

router.post(
    "/verify-subscribe-email",
    validate({
        body: verifyEmailSchema,
    }),
    asyncHandler(
        userController.verifyEmailAndSubscribe.bind(
            userController
        )
    )
);

router.post(
    "/resend-verification-otp",
    validate({
        body: resendVerificationOtpSchema,
    }),
    asyncHandler(
        userController.resendVerificationOtp.bind(
            userController
        )
    )
);

router.get(
    "/me",
    asyncHandler(
        me.me.bind(me)
    )
);

export default router;