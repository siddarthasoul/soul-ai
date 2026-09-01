import authApi from "@/src/lib/api/auth.api";

import type {
    RequestLoginOtpInput,
    VerifyLoginOtpInput,
} from "@/src/types/auth";

export const authService = {

    async requestLoginOtp(
        input: RequestLoginOtpInput
    ) {
        const response =
            await authApi.requestLoginOtp(input);

        return response.data;
    },

    async verifyLoginOtp(
        input: VerifyLoginOtpInput
    ) {
        const response =
            await authApi.verifyLoginOtp(input);

        return response.data;
    },

} as const;

export default authService;