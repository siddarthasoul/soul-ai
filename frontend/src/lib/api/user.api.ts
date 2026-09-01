import apiClient from "./client";

import apiConfig from "@/src/config/api.config";

import type { ApiResponse } from "@/src/types/api";

import type {
    User,
    CreateUserInput,
    VerifyEmailInput,
} from "@/src/types/user";

const USER_PREFIX =
    `${apiConfig.apiPrefix}/users`;

export const userApi = {

    createUser(
        input: CreateUserInput
    ) {
        return apiClient.post<
            ApiResponse<User>
        >(
            USER_PREFIX,
            input
        );
    },

    verifyEmailAndSubscribe(
        input: VerifyEmailInput
    ) {
        return apiClient.post<
            ApiResponse<User>
        >(
            `${USER_PREFIX}/verify-subscribe-email`,
            input
        );
    },

    resendVerificationOtp(
        email: string
    ) {
        return apiClient.post<
            ApiResponse<null>
        >(
            `${USER_PREFIX}/resend-verification-otp`,
            { email }
        );
    },

} as const;

export default userApi;