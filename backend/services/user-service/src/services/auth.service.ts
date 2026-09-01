import { ApiError } from "../../../../packages/common/utils/apiError.js";

import userRepository from "../repositories/user.repository.js";
import otpRepository from "../repositories/otp.repository.js";
import type { LoginResult } from "../types/user.types.js"
import sessionService from "./session.service.js";
import emailService from "./email.service.js";
import env from "../../../../packages/common/config/env.js";
import { generateOtp } from "../utils/otp.utils.js";
import otpProtectionService
    from "../../../../packages/common/redis/otp-protection.service.js";
import userCacheService from "../../../../packages/common/redis/user-cache.service.js";



export class AuthService {

    async requestLoginOtp(
        email: string
    ): Promise<void> {
        const user =
            await userRepository.findByEmail(email);

        if (!user) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

        if (!user.isEmailVerified) {
            throw new ApiError(
                403,
                "Email is not verified"
            );
        }

        if (user.isBlocked) {
            throw new ApiError(
                403,
                "User account is blocked"
            );
        }

        await otpProtectionService.checkRequest(
            email
        );

        const otp = generateOtp();

        await otpRepository.saveOtp(
            email,
            otp,
            env.auth.otp.ttlSeconds
        );

        await emailService.sendVerificationOtp(
            email,
            otp
        );
    }

    async verifyLoginOtp(
        email: string,
        otp: string
    ): Promise<LoginResult> {

        const user =
            await userRepository.findByEmail(email);

        if (!user) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

        if (!user.isEmailVerified) {
            throw new ApiError(
                403,
                "Email is not verified"
            );
        }

        if (user.isBlocked) {
            throw new ApiError(
                403,
                "User account is blocked"
            );
        }

        const storedOtp =
            await otpRepository.getOtp(email);

        if (!storedOtp) {
            throw new ApiError(
                400,
                "OTP has expired or does not exist"
            );
        }

        if (storedOtp !== otp) {
            await otpProtectionService.checkAttempt(
                email
            );

            throw new ApiError(
                400,
                "Invalid OTP"
            );
        }

        // Deletes previous session and creates a new one.
        const sessionId =
            await sessionService.createSession(
                user._id.toString()
            );

        await otpRepository.deleteOtp(email);

        await otpProtectionService.resetAttempts(
            email
        );

        await userCacheService.set(
            {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                isEmailVerified:
                    user.isEmailVerified,
            },
            env.auth.session.ttlSeconds
        );

        return {
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
            sessionId,
        };
    }
}

const authService = new AuthService();

export default authService;