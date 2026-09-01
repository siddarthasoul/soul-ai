"use client";

import { useCallback } from "react";

import authService from "@/src/services/auth.service";

import { useAuthStore } from "@/src/stores/auth.store";
import { useUserStore } from "@/src/stores/user.store";

import type {
    RequestLoginOtpInput,
    VerifyLoginOtpInput,
} from "@/src/types/auth";

export function useAuth() {
    const isAuthenticated =
        useAuthStore(
            (state) =>
                state.isAuthenticated
        );

    const isLoading =
        useAuthStore(
            (state) =>
                state.isLoading
        );

    const setAuthenticated =
        useAuthStore(
            (state) =>
                state.setAuthenticated
        );

    const setLoading =
        useAuthStore(
            (state) =>
                state.setLoading
        );

    const setUser =
        useUserStore(
            (state) =>
                state.setUser
        );

    const clearUser =
        useUserStore(
            (state) =>
                state.clearUser
        );

    const requestOtp =
        useCallback(
            async (
                input: RequestLoginOtpInput
            ) => {
                setLoading(true);

                try {
                    return await authService
                        .requestLoginOtp(
                            input
                        );
                } finally {
                    setLoading(false);
                }
            },
            [setLoading]
        );

    const verifyOtp =
        useCallback(
            async (
                input: VerifyLoginOtpInput
            ) => {
                setLoading(true);

                try {
                    const response =
                        await authService
                            .verifyLoginOtp(
                                input
                            );

                    if (
                        response.success &&
                        response.data
                    ) {
                        setUser(
                            response.data
                        );

                        setAuthenticated(
                            true
                        );
                    }

                    return response;
                } finally {
                    setLoading(false);
                }
            },
            [
                setLoading,
                setUser,
                setAuthenticated,
            ]
        );

    const logout =
        useCallback(() => {
            clearUser();

            setAuthenticated(
                false
            );
        }, [
            clearUser,
            setAuthenticated,
        ]);

    return {
        isAuthenticated,
        isLoading,
        requestOtp,
        verifyOtp,
        logout,
    };
}

export default useAuth;