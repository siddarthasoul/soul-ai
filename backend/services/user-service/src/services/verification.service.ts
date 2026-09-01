import type {
    verifyEmailAndSubscribeInput,
} from "../validation/user.validation.js";
import { type verifyEmailAndSubscribe } from "../types/user.types.js"
import env from "../../../../packages/common/config/env.js";
import userRepository from "../repositories/user.repository.js";
import otpRepository from "../repositories/otp.repository.js";
import { generateOtp } from "../utils/otp.utils.js";
import emailService from "./email.service.js";
import { ApiError } from "../../../../packages/common/utils/apiError.js";
import sessionService from "./session.service.js";
import otpProtectionService
    from "../../../../packages/common/redis/otp-protection.service.js";



export class VerificationService {


    async generateAndSaveOtp(
        email: string
    ): Promise<void> {

        await otpProtectionService.checkRequest(
            email
        );

        // Remove previous OTP if it exists
        await otpRepository.deleteOtp(email);

        // Generate new OTP
        const otp = generateOtp();

        // Save new OTP with TTL
        await otpRepository.saveOtp(
            email,
            otp,
            env.auth.otp.ttlSeconds
        );

        // Send new OTP
        await emailService.sendVerificationOtp(
            email,
            otp
        );
    }

    async verifyEmailAndSubscribe(
        data: verifyEmailAndSubscribeInput
    ): Promise<verifyEmailAndSubscribe> {

        const { email, otp } = data;

        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

        if (user.isEmailVerified) {
            throw new ApiError(
                400,
                "User already Subscribe"
            );
        }

        const storedOtp = await otpRepository.getOtp(email);

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

        const verifiedUser =
            await userRepository.verifyEmailAndSubscribe(
                user._id.toString()
            );

        if (!verifiedUser) {
            throw new ApiError(
                500,
                "Failed to verify email"
            );
        }

        const sessionId = await sessionService.createSession(
            verifiedUser._id.toString()
        );

        await otpRepository.deleteOtp(email);
        await otpProtectionService.resetAttempts(
            email
        );

        return {
            user: {
                id: verifiedUser._id.toString(),
                name: verifiedUser.name,
                email: verifiedUser.email,
                dob: verifiedUser.dob,
                isEmailVerified: verifiedUser.isEmailVerified,
                isSubscribed: verifiedUser.isSubscribed,
                isBlocked: verifiedUser.isBlocked,
            },
            sessionId,
        };
    }
}

const verificationService = new VerificationService();

export default verificationService