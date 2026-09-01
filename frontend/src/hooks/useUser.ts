"use client";

import { useCallback } from "react";

import userService from "@/src/services/user.service";

import { useAuthStore } from "@/src/stores/auth.store";
import { useUserStore } from "@/src/stores/user.store";

import type {
    CreateUserInput,
    VerifyEmailInput,
} from "@/src/types/user";

export function useUser() {
    const user = useUserStore(
        (state) => state.user
    );

    const setUser = useUserStore(
        (state) => state.setUser
    );

    const updateUser = useUserStore(
        (state) => state.updateUser
    );

    const setAuthenticated = useAuthStore(
        (state) => state.setAuthenticated
    );

    // ============================================================
    // CREATE USER
    // ============================================================

    const createUser = useCallback(
        async (
            input: CreateUserInput
        ) => {
            const response =
                await userService.createUser(
                    input
                );

            /*
             * Registration does NOT authenticate
             * the user.
             *
             * Backend sends OTP.
             *
             * We can store the returned user locally,
             * but authenticated must remain false.
             */

            if (
                response.success &&
                response.data
            ) {
                setUser(response.data);
                setAuthenticated(false);
            }

            return response;
        },
        [
            setUser,
            setAuthenticated,
        ]
    );

    // ============================================================
    // VERIFY EMAIL
    // ============================================================

    const verifyEmail = useCallback(
        async (
            input: VerifyEmailInput
        ) => {
            const response =
                await userService.verifyEmailAndSubscribe(
                    input
                );

            /*
             * Backend:
             *
             * 1. Verify OTP
             * 2. Verify email
             * 3. Subscribe user
             * 4. Create session
             * 5. Set HttpOnly session cookie
             */

            if (
                response.success &&
                response.data
            ) {
                setUser(response.data);

                /*
                 * Session cookie is now created
                 * by the backend.
                 */
                setAuthenticated(true);
            }

            return response;
        },
        [
            setUser,
            setAuthenticated,
        ]
    );

    // ============================================================
    // RESEND OTP
    // ============================================================

    const resendVerificationOtp =
        useCallback(
            async (
                email: string
            ) => {
                return userService
                    .resendVerificationOtp(
                        email
                    );
            },
            []
        );

    // ============================================================
    // RETURN
    // ============================================================

    return {
        user,
        createUser,
        verifyEmail,
        resendVerificationOtp,
        updateUser,
    };
}

export default useUser;