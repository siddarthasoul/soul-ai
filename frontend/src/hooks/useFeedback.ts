
"use client";

import axios from "axios";
import { useCallback, useEffect } from "react";

import feedbackService from "@/src/services/feedback.service";
import { useFeedbackStore } from "@/src/stores/feedback.store";

import type {
    CreateFeedbackInput,
    Feedback,
} from "@/src/types/feedback.types";

interface FeedbackResult {
    feedbackId: string;
    overall: number;
    message: string;
}

interface UseFeedbackReturn {
    feedback: Feedback[];
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    success: boolean;
    rateLimited: boolean;
    retryAfter: number;

    submitFeedback: (
        data: CreateFeedbackInput
    ) => Promise<FeedbackResult | null>;

    refreshFeedback: () => Promise<void>;

    deleteFeedback: (
        feedbackId: string
    ) => Promise<void>;

    clearError: () => void;
    clearSuccess: () => void;
}

export function useFeedback(
    isAuthenticated: boolean
): UseFeedbackReturn {
    const feedback = useFeedbackStore(
        (state) => state.feedback
    );

    const isLoading = useFeedbackStore(
        (state) => state.isLoading
    );

    const isSubmitting = useFeedbackStore(
        (state) => state.isSubmitting
    );

    const error = useFeedbackStore(
        (state) => state.error
    );

    const storeSuccess = useFeedbackStore(
        (state) => state.success
    );

    const rateLimited = useFeedbackStore(
        (state) => state.rateLimited
    );

    const retryAfter = useFeedbackStore(
        (state) => state.retryAfter
    );

    const setFeedback = useFeedbackStore(
        (state) => state.setFeedback
    );

    const setLoading = useFeedbackStore(
        (state) => state.setLoading
    );

    const setSubmitting = useFeedbackStore(
        (state) => state.setSubmitting
    );

    const setError = useFeedbackStore(
        (state) => state.setError
    );

    const setSuccess = useFeedbackStore(
        (state) => state.setSuccess
    );

    const setRateLimit = useFeedbackStore(
        (state) => state.setRateLimit
    );

    const clearRateLimit = useFeedbackStore(
        (state) => state.clearRateLimit
    );

    const clearError = useFeedbackStore(
        (state) => state.clearError
    );

    const clearSuccess = useFeedbackStore(
        (state) => state.clearSuccess
    );

    const removeFeedback = useFeedbackStore(
        (state) => state.removeFeedback
    );

    // ============================================================
    // FETCH FEEDBACK
    // ============================================================

    const refreshFeedback = useCallback(
        async (): Promise<void> => {
            if (!isAuthenticated) {
                setFeedback([]);
                return;
            }

            try {
                setLoading(true);
                clearError();

                const result =
                    await feedbackService.getMyFeedback();

                setFeedback(result);
            } catch (error) {
                console.error(
                    "[useFeedback] FETCH FAILED:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load feedback"
                );
            } finally {
                setLoading(false);
            }
        },
        [
            isAuthenticated,
            setFeedback,
            setLoading,
            clearError,
            setError,
        ]
    );

    // ============================================================
    // SUBMIT FEEDBACK
    // ============================================================

    const submitFeedback = useCallback(
        async (
            data: CreateFeedbackInput
        ): Promise<FeedbackResult | null> => {
            if (!isAuthenticated) {
                throw new Error(
                    "Please login and verify your account before submitting feedback."
                );
            }

            /*
             * Never send another request while the client
             * already knows that the user is rate limited.
             */
            if (
                rateLimited &&
                retryAfter > 0
            ) {
                return null;
            }

            try {
                setSubmitting(true);
                clearError();
                clearSuccess();

                const result =
                    await feedbackService.createFeedback(
                        data
                    );

                /*
                 * Backend accepted the feedback.
                 */
                clearRateLimit();

                setSuccess({
                    feedbackId:
                        result.feedbackId,
                    overall:
                        result.overall,
                    message:
                        result.message,
                });

                await refreshFeedback();

                return result;
            } catch (error) {
                // ====================================================
                // AXIOS ERROR
                // ====================================================

                if (axios.isAxiosError(error)) {
                    const status =
                        error.response?.status;

                    const responseData =
                        error.response?.data;

                    const backendMessage =
                        responseData?.message ||
                        responseData?.error;

                    // =================================================
                    // 429 RATE LIMIT
                    // =================================================

                    if (status === 429) {
                        let retryAfterSeconds = 0;

                        /*
                         * First try Retry-After header.
                         */
                        const retryAfterHeader =
                            error.response?.headers?.[
                                "retry-after"
                            ];

                        if (
                            typeof retryAfterHeader ===
                            "string"
                        ) {
                            const parsed =
                                Number(
                                    retryAfterHeader
                                );

                            if (
                                Number.isFinite(
                                    parsed
                                )
                            ) {
                                retryAfterSeconds =
                                    Math.max(
                                        Math.ceil(
                                            parsed
                                        ),
                                        0
                                    );
                            }
                        }

                        /*
                         * If header is unavailable,
                         * extract seconds from backend message.
                         *
                         * Example:
                         * "Try again in 86345 seconds."
                         */
                        if (
                            retryAfterSeconds <= 0 &&
                            typeof backendMessage ===
                                "string"
                        ) {
                            const match =
                                backendMessage.match(
                                    /(\d+)\s*seconds?/i
                                );

                            if (match) {
                                retryAfterSeconds =
                                    Number(
                                        match[1]
                                    );
                            }
                        }

                        /*
                         * Safe fallback.
                         *
                         * Your backend currently uses
                         * a 24-hour feedback window.
                         */
                        if (
                            retryAfterSeconds <= 0
                        ) {
                            retryAfterSeconds =
                                86400;
                        }

                        /*
                         * Store rate-limit state.
                         *
                         * This drives the UI.
                         */
                        setRateLimit(
                            retryAfterSeconds
                        );

                        /*
                         * 429 is expected application
                         * state, NOT a normal error.
                         */
                        clearError();

                        /*
                         * IMPORTANT:
                         * Do not throw the 429.
                         */
                        return null;
                    }

                    // =================================================
                    // OTHER HTTP ERROR
                    // =================================================

                    setError(
                        typeof backendMessage ===
                            "string"
                            ? backendMessage
                            : "Failed to submit feedback."
                    );

                    throw error;
                }

                // ====================================================
                // NON-AXIOS ERROR
                // ====================================================

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to submit feedback."
                );

                throw error;
            } finally {
                setSubmitting(false);
            }
        },
        [
            isAuthenticated,
            rateLimited,
            retryAfter,
            setSubmitting,
            clearError,
            clearSuccess,
            clearRateLimit,
            setSuccess,
            refreshFeedback,
            setError,
            setRateLimit,
        ]
    );

    // ============================================================
    // DELETE FEEDBACK
    // ============================================================

    const deleteFeedback = useCallback(
        async (
            feedbackId: string
        ): Promise<void> => {
            try {
                clearError();

                await feedbackService.deleteMyFeedback(
                    feedbackId
                );

                removeFeedback(feedbackId);
            } catch (error) {
                console.error(
                    "[useFeedback] DELETE FAILED:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to delete feedback"
                );

                throw error;
            }
        },
        [
            clearError,
            removeFeedback,
            setError,
        ]
    );

    // ============================================================
    // INITIAL FETCH
    // ============================================================

    useEffect(() => {
        void refreshFeedback();
    }, [refreshFeedback]);

    return {
        feedback,
        isLoading,
        isSubmitting,
        error,

        success:
            storeSuccess !== null,

        rateLimited,
        retryAfter,

        submitFeedback,
        refreshFeedback,
        deleteFeedback,

        clearError,
        clearSuccess,
    };
}

export default useFeedback;
