import type {
    Request,
    Response,
} from "express";

import {
    asyncHandler,
} from "../../../../packages/common/utils/asyncHandler.js";

import {
    ApiResponse,
} from "../../../../packages/common/utils/apiResponse.js";

import {
    ApiError,
} from "../../../../packages/common/utils/apiError.js";

import feedbackService from "../services/feedback.service.js";

/**
 * Get request identity.
 *
 * Identity is provided by identityMiddleware
 * through req.identity.
 */
const getIdentity = (req: Request) => {
    const userId = req.identity?.userId;
    const guestId = req.identity?.guestId;

    if (!userId && !guestId) {
        throw new ApiError(
            401,
            "Identity required"
        );
    }

    return {
        userId,
        guestId,
    };
};

/**
 * Get and validate feedback ID.
 */
const getFeedbackId = (
    value: string | string[] | undefined
): string => {
    if (!value) {
        throw new ApiError(
            400,
            "Feedback ID is required"
        );
    }

    if (Array.isArray(value)) {
        throw new ApiError(
            400,
            "Invalid Feedback ID"
        );
    }

    const feedbackId = value.trim();

    if (!feedbackId) {
        throw new ApiError(
            400,
            "Feedback ID is required"
        );
    }

    return feedbackId;
};

class FeedbackController {

    /**
     * POST /feedback
     *
     * Submit new feedback.
     */
    createFeedback = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {
            const identity =
                getIdentity(req);

            const result =
                await feedbackService.createFeedback(
                    identity,
                    req.body
                );

            return ApiResponse.created(
                res,
                result,
                "Thank you for your feedback!"
            );
        }
    );

    /**
     * GET /feedback/me
     *
     * Get feedback submitted by
     * the current identity.
     */
    getMyFeedback = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {
            const identity =
                getIdentity(req);

            const feedback =
                await feedbackService.getMyFeedback(
                    identity
                );

            return ApiResponse.success(
                res,
                feedback,
                "Your feedback retrieved successfully"
            );
        }
    );

    /**
     * GET /feedback/:feedbackId
     *
     * Get feedback belonging to
     * the current identity.
     */
    getFeedbackById = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {
            const identity =
                getIdentity(req);

            const feedbackId =
                getFeedbackId(
                    req.params.feedbackId
                );

            const feedback =
                await feedbackService.getFeedbackById(
                    feedbackId,
                    identity
                );

            return ApiResponse.success(
                res,
                feedback,
                "Feedback retrieved successfully"
            );
        }
    );
}

export default new FeedbackController();