import { Router } from "express";

import {
    identityMiddleware,
} from "../../../../packages/common/middlewares/identity.middleware.js";

import {
    requireAuthMiddleware,
} from "../../../../packages/common/middlewares/auth.middleware.js";

import {
    validate,
} from "../../../../packages/common/middlewares/validation.middleware.js";

import feedbackController from "../controllers/feedback.controller.js";

import {
    createFeedbackSchema,
    feedbackIdParamsSchema,
} from "../validation/feedback.validation.js";

const router = Router();

/**
 * POST /feedback
 *
 * Create new feedback.
 */
router.post(
    "/",
    identityMiddleware,
    requireAuthMiddleware,
    validate({body: createFeedbackSchema}),
    feedbackController.createFeedback
);

/**
 * GET /feedback/me
 *
 * Get all feedback submitted by current user.
 */
router.get(
    "/me",
    identityMiddleware,
    requireAuthMiddleware,
    feedbackController.getMyFeedback
);

/**
 * GET /feedback/:feedbackId
 *
 * Get one feedback belonging to current user.
 */
router.get(
    "/:feedbackId",
    identityMiddleware,
    requireAuthMiddleware,
    validate({body :feedbackIdParamsSchema}),
    feedbackController.getFeedbackById
);

/**
 * DELETE /feedback/:feedbackId
 *
 * Delete feedback belonging to current user.
 */
router.delete(
    "/:feedbackId",
    identityMiddleware,
    requireAuthMiddleware,
    validate({body: feedbackIdParamsSchema}),
    feedbackController.deleteMyFeedback
);

export default router;