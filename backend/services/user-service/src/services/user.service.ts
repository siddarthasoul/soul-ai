import type { CreateUserInput } from "../validation/user.validation.js";

import userRepository from "../repositories/user.repository.js";
import verificationService from "./verification.service.js";
import { ApiError } from "../../../../packages/common/utils/apiError.js";
import type { RegisterResponse } from "../types/user.types.js"

export class UserService {


    async createUser(
        data: CreateUserInput
    ): Promise<RegisterResponse> {

        const existingUser =
            await userRepository.findByEmail(
                data.email
            );

        if (existingUser) {
            throw new ApiError(
                409,
                "User already Subscribe"
            );
        }

        const user =
            await userRepository.createUser(data);

        await verificationService.generateAndSaveOtp(
            user.email
        );

        return {
            message: "Registration successful. Verification OTP sent to your email.",
            email: user.email,
            requiresEmailVerification: true,
        };
    }
}

const userService = new UserService()

export default userService;