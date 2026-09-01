import apiClient from "@/src/lib/api/client";
import type { ApiResponse } from "@/src/types/api";
import type {
    CreateFeedbackInput,
    Feedback,
} from "@/src/types/feedback.types";

import apiConfig from "@/src/config/api.config";

const FEEDBACK_PREFIX = `${apiConfig.apiPrefix}/feedback`;

const feedbackApi = {

    getMyFeedback() {
        return apiClient.get<
            ApiResponse<Feedback[]>
        >(
            `${FEEDBACK_PREFIX}/me`
        );
    },

    getFeedbackById(
        feedbackId: string
    ) {
        return apiClient.get<
            ApiResponse<Feedback>
        >(
            `${FEEDBACK_PREFIX}/${feedbackId}`
        );
    },

    createFeedback(
        data: CreateFeedbackInput
    ) {
        return apiClient.post<
            ApiResponse<{
                feedbackId: string;
                overall: number;
                message: string;
            }>
        >(
            FEEDBACK_PREFIX,
            data
        );
    },

    deleteMyFeedback(
        feedbackId: string
    ) {
        return apiClient.delete<
            ApiResponse<null>
        >(
            `${FEEDBACK_PREFIX}/${feedbackId}`
        );
    },

} as const;

export default feedbackApi;