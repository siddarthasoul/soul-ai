import { ApiError } from "../../../../packages/common/utils/apiError.js";
import logger from "../../../../packages/common/utils/logger.js";
import feedbackProtectionService from "../../../../packages/common/redis/feedbackProtection.service.js";
import feedbackRepository from "../repositories/feedback.repository.js";

import type {
    CreateFeedbackInput,
} from "../types/feedback.types.js";

class FeedbackService {
    /**
     * Create feedback
     */
    async createFeedback(
        userId: string,
        data: CreateFeedbackInput
    ) {
        const ratingValues = Object.values(
            data.ratings
        ).filter(
            (value): value is number =>
                typeof value === "number"
        );

        if (ratingValues.length === 0) {
            throw new ApiError(
                400,
                "At least one rating is required"
            );
        }

        const total = ratingValues.reduce(
            (sum, value) => sum + value,
            0
        );

        const overall = Number(
            (total / ratingValues.length).toFixed(2)
        );

        // Check protection only after
        // the request has passed validation.
        await feedbackProtectionService.checkRequest(
            userId
        );

        const feedback =
            await feedbackRepository.create({
                ...data,
                userId,
                overall,
            });

        logger.info("Feedback created", {
            feedbackId: feedback._id.toString(),
            userId,
            type: feedback.type,
            overall: feedback.overall,
        });

        return {
            feedbackId: feedback._id.toString(),
            overall: feedback.overall,
            message:
                "Your feedback helps us make Soul better.",
        };
    }

    /**
     * Get current user's feedback
     */
    async getMyFeedback(
        userId: string | undefined
    ) {
        if (!userId) {
            throw new ApiError(
                401,
                "Authentication required"
            );
        }

        return feedbackRepository.findByUserId(
            userId
        );
    }

    /**
     * Get one feedback belonging to current user
     */
    async getFeedbackById(
        feedbackId: string,
        userId: string | undefined
    ) {
        if (!userId) {
            throw new ApiError(
                401,
                "Authentication required"
            );
        }

        const feedback =
            await feedbackRepository.findByIdForUser(
                feedbackId,
                userId
            );

        if (!feedback) {
            throw new ApiError(
                404,
                "Feedback not found"
            );
        }

        return feedback;
    }

    /**
     * Delete user's feedback
     */
    async deleteMyFeedback(
        feedbackId: string,
        userId: string | undefined
    ) {
        if (!userId) {
            throw new ApiError(
                401,
                "Authentication required"
            );
        }

        const feedback =
            await feedbackRepository.deleteByIdForUser(
                feedbackId,
                userId
            );

        if (!feedback) {
            throw new ApiError(
                404,
                "Feedback not found"
            );
        }

        logger.info(
            "Feedback deleted",
            {
                feedbackId,
                userId,
            }
        );
    }
}

export default new FeedbackService();