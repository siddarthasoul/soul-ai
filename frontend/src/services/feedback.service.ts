import feedbackApi from "@/src/lib/api/feedbcak.api";

import type {
    CreateFeedbackInput,
    Feedback,
} from "@/src/types/feedback.types";

class FeedbackService {

    async getMyFeedback(): Promise<Feedback[]> {
        const response =
            await feedbackApi.getMyFeedback();

        return response.data.data;
    }

    async getFeedbackById(
        feedbackId: string
    ): Promise<Feedback> {
        const response =
            await feedbackApi.getFeedbackById(
                feedbackId
            );

        return response.data.data;
    }

    async createFeedback(
        data: CreateFeedbackInput
    ) {
        const response =
            await feedbackApi.createFeedback(data);

        return response.data.data;
    }

    async deleteMyFeedback(
        feedbackId: string
    ): Promise<void> {
        await feedbackApi.deleteMyFeedback(
            feedbackId
        );
    }
}

const feedbackService = new FeedbackService();

export default feedbackService;