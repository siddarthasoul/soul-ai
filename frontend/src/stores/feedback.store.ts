import { create } from "zustand";

import type {
    Feedback,
} from "@/src/types/feedback.types";

interface FeedbackSuccess {
    feedbackId: string;
    overall: number;
    message: string;
}

interface FeedbackStore {
    feedback: Feedback[];

    isLoading: boolean;

    isSubmitting: boolean;

    error: string | null;

    success: FeedbackSuccess | null;

    rateLimited: boolean;

    retryAfter: number;

    setFeedback: (
        feedback: Feedback[]
    ) => void;

    addFeedback: (
        feedback: Feedback
    ) => void;

    removeFeedback: (
        feedbackId: string
    ) => void;

    setLoading: (
        value: boolean
    ) => void;

    setSubmitting: (
        value: boolean
    ) => void;

    setError: (
        error: string | null
    ) => void;

    setSuccess: (
        success: FeedbackSuccess | null
    ) => void;

    setRateLimit: (
        retryAfter: number
    ) => void;

    clearRateLimit: () => void;

    clearError: () => void;

    clearSuccess: () => void;

    reset: () => void;
}

const initialState: Pick<
    FeedbackStore,
    | "feedback"
    | "isLoading"
    | "isSubmitting"
    | "error"
    | "success"
    | "rateLimited"
    | "retryAfter"
> = {
    feedback: [],

    isLoading: false,

    isSubmitting: false,

    error: null,

    success: null,

    rateLimited: false,

    retryAfter: 0,
};

export const useFeedbackStore =
    create<FeedbackStore>()(
        (set) => ({
            ...initialState,

            setFeedback: (
                feedback
            ) => {
                set({
                    feedback,
                });
            },

            addFeedback: (
                feedback
            ) => {
                set((state) => ({
                    feedback: [
                        feedback,
                        ...state.feedback,
                    ],
                }));
            },

            removeFeedback: (
                feedbackId
            ) => {
                set((state) => ({
                    feedback:
                        state.feedback.filter(
                            (item) =>
                                item.id !==
                                feedbackId
                        ),
                }));
            },

            setLoading: (
                value
            ) => {
                set({
                    isLoading: value,
                });
            },

            setSubmitting: (
                value
            ) => {
                set({
                    isSubmitting: value,
                });
            },

            setError: (
                error
            ) => {
                set({
                    error,
                });
            },

            setSuccess: (
                success
            ) => {
                set({
                    success,
                });
            },

            setRateLimit: (
                retryAfter
            ) => {
                set({
                    rateLimited: true,
                    retryAfter,
                });
            },

            clearRateLimit: () => {
                set({
                    rateLimited: false,
                    retryAfter: 0,
                });
            },

            clearError: () => {
                set({
                    error: null,
                });
            },

            clearSuccess: () => {
                set({
                    success: null,
                });
            },

            reset: () => {
                set({
                    ...initialState,
                });
            },
        })
    );

export type {
    FeedbackStore,
    FeedbackSuccess,
};
