import apiClient from "./client";

import apiConfig from "@/src/config/api.config";

import type { ApiResponse } from "@/src/types/api";
import type {
    RequestLoginOtpInput,
    VerifyLoginOtpInput,
} from "@/src/types/auth";
import type { User } from "@/src/types/user";

const AUTH_PREFIX =
    `${apiConfig.apiPrefix}/auth`;

export const authApi = {

    requestLoginOtp(
        input: RequestLoginOtpInput
    ) {
        return apiClient.post<
            ApiResponse<null>
        >(
            `${AUTH_PREFIX}/request-otp`,
            input
        );
    },

    verifyLoginOtp(
        input: VerifyLoginOtpInput
    ) {
        return apiClient.post<
            ApiResponse<User>
        >(
            `${AUTH_PREFIX}/verify-otp`,
            input
        );
    },

} as const;

export default authApi;