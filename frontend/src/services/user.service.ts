import userApi from "@/src/lib/api/user.api";

import type {
    CreateUserInput,
    VerifyEmailInput,
} from "@/src/types/user";

export const userService = {

    async createUser(
        input: CreateUserInput
    ) {
        const response =
            await userApi.createUser(input);

        return response.data;
    },

    async verifyEmailAndSubscribe(
        input: VerifyEmailInput
    ) {
        const response =
            await userApi.verifyEmailAndSubscribe(
                input
            );

        return response.data;
    },

    async resendVerificationOtp(
        email: string
    ) {
        const response =
            await userApi.resendVerificationOtp(
                email
            );

        return response.data;
    },

} as const;

export default userService;