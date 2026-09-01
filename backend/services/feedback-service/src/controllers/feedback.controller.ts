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
 * Get authenticated user ID.
 *
 * Authentication is provided by identityMiddleware
 * through req.identity.userId.
 */
const getUserId = (
    req: Request
): string => {
    const userId = req.identity?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required"
        );
    }

    return userId;
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

    return value.trim();
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
            const userId =
                getUserId(req);

            const result =
                await feedbackService.createFeedback(
                    userId,
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
     * the authenticated user.
     */
    getMyFeedback = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {
            const userId =
                getUserId(req);

            const feedback =
                await feedbackService.getMyFeedback(
                    userId
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
     * Get one feedback belonging
     * to the authenticated user.
     */
    getFeedbackById = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {
            const userId =
                getUserId(req);

            const feedbackId =
                getFeedbackId(
                    req.params.feedbackId
                );

            const feedback =
                await feedbackService.getFeedbackById(
                    feedbackId,
                    userId
                );

            return ApiResponse.success(
                res,
                feedback,
                "Feedback retrieved successfully"
            );
        }
    );

    /**
     * DELETE /feedback/:feedbackId
     *
     * Delete feedback belonging
     * to the authenticated user.
     */
    deleteMyFeedback = asyncHandler(
        async (
            req: Request,
            res: Response
        ) => {
            const userId =
                getUserId(req);

            const feedbackId =
                getFeedbackId(
                    req.params.feedbackId
                );

            await feedbackService.deleteMyFeedback(
                feedbackId,
                userId
            );

            return ApiResponse.noContent(res);
        }
    );
}

export default new FeedbackController();