import { ApiError } from "../../../../packages/common/utils/apiError.js";

import logger from "../../../../packages/common/utils/logger.js";

import feedbackProtectionService from "../../../../packages/common/redis/feedbackProtection.service.js";

import feedbackRepository from "../repositories/feedback.repository.js";

import type {
    CreateFeedbackInput,
} from "../types/feedback.types.js";

export interface FeedbackIdentity {
    userId?: string | undefined;
    guestId?: string | undefined;
}

class FeedbackService {

    /**
     * Create feedback
     */
    async createFeedback(
        identity: FeedbackIdentity,
        data: CreateFeedbackInput
    ) {
        const { userId, guestId } = identity;

        if (!userId && !guestId) {
            throw new ApiError(
                401,
                "Identity required"
            );
        }

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

        /**
         * Use the identity as the protection key.
         * User and guest identities are kept separate.
         */
        const protectionKey =
            userId || guestId;

        if (!protectionKey) {
            throw new ApiError(
                401,
                "Identity required"
            );
        }

        await feedbackProtectionService.checkRequest(
            protectionKey
        );

        const feedback =
            await feedbackRepository.create({
                ...data,
                userId: userId ?? null,
                guestId: guestId ?? null,
                overall,
            });

        logger.info("Feedback created", {
            feedbackId:
                feedback._id.toString(),
            userId,
            guestId,
            type: feedback.type,
            overall: feedback.overall,
        });

        return {
            feedbackId:
                feedback._id.toString(),
            overall: feedback.overall,
            message:
                "Your feedback helps us make Soul better.",
        };
    }

    /**
     * Get current identity's feedback
     */
    async getMyFeedback(
        identity: FeedbackIdentity
    ) {
        const { userId, guestId } = identity;

        if (!userId && !guestId) {
            throw new ApiError(
                401,
                "Identity required"
            );
        }

        if (userId) {
            return feedbackRepository.findByUserId(
                userId
            );
        }

        return feedbackRepository.findByGuestId(
            guestId!
        );
    }

    /**
     * Get one feedback belonging
     * to current identity
     */
    async getFeedbackById(
        feedbackId: string,
        identity: FeedbackIdentity
    ) {
        const { userId, guestId } = identity;

        if (!userId && !guestId) {
            throw new ApiError(
                401,
                "Identity required"
            );
        }

        const feedback = userId
            ? await feedbackRepository.findByIdForUser(
                feedbackId,
                userId
            )
            : await feedbackRepository.findByIdForGuest(
                feedbackId,
                guestId!
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
     * Delete current identity's feedback
     */
    async deleteMyFeedback(
        feedbackId: string,
        identity: FeedbackIdentity
    ) {
        const { userId, guestId } = identity;

        if (!userId && !guestId) {
            throw new ApiError(
                401,
                "Identity required"
            );
        }

        const feedback = userId
            ? await feedbackRepository.deleteByIdForUser(
                feedbackId,
                userId
            )
            : await feedbackRepository.deleteByIdForGuest(
                feedbackId,
                guestId!
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
                guestId,
            }
        );
    }
}

export default new FeedbackService();