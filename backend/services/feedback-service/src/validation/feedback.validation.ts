import { z } from "zod";

/**
 * Rating validation
 *
 * Every rating is optional because different
 * feedback categories can contain different ratings.
 */
const ratingValueSchema = z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must not exceed 5");

/**
 * Individual product ratings.
 *
 * `overall` is intentionally NOT accepted here.
 * It is calculated by the backend.
 */
export const feedbackRatingsSchema = z
    .object({
        // AI Experience
        accuracy: ratingValueSchema.optional(),
        relevance: ratingValueSchema.optional(),
        clarity: ratingValueSchema.optional(),
        completeness: ratingValueSchema.optional(),
        reasoning: ratingValueSchema.optional(),
        formatting: ratingValueSchema.optional(),
        speed: ratingValueSchema.optional(),

        // Chat Experience
        conversationFlow: ratingValueSchema.optional(),
        memory: ratingValueSchema.optional(),
        streaming: ratingValueSchema.optional(),
        composer: ratingValueSchema.optional(),

        // UI / UX
        design: ratingValueSchema.optional(),
        navigation: ratingValueSchema.optional(),
        easeOfUse: ratingValueSchema.optional(),
        responsiveness: ratingValueSchema.optional(),
        animations: ratingValueSchema.optional(),

        // Performance
        pageLoading: ratingValueSchema.optional(),
        stability: ratingValueSchema.optional(),
    })
    .strict()
    .refine(
        (ratings) =>
            Object.values(ratings).some(
                (value) => value !== undefined
            ),
        {
            message:
                "At least one rating is required",
        }
    );

/**
 * Feedback type
 */
export const feedbackTypeSchema = z.enum([
    "general",
    "ai",
    "chat",
    "ui",
    "performance",
    "bug",
    "feature",
]);

/**
 * Problems selected by user
 */
export const feedbackProblemSchema = z.enum([
    "ai_quality",
    "ui",
    "bug",
    "speed",
    "chat",
    "feature",
    "other",
]);

/**
 * Automatically collected client metadata
 */
export const feedbackMetadataSchema = z
    .object({
        browser: z
            .string()
            .trim()
            .max(100)
            .optional(),

        os: z
            .string()
            .trim()
            .max(100)
            .optional(),

        device: z
            .enum([
                "desktop",
                "tablet",
                "mobile",
                "unknown",
            ])
            .optional(),

        screenWidth: z
            .number()
            .int()
            .min(0)
            .optional(),

        screenHeight: z
            .number()
            .int()
            .min(0)
            .optional(),

        appVersion: z
            .string()
            .trim()
            .max(50)
            .optional(),

        page: z
            .string()
            .trim()
            .max(500)
            .optional(),
    })
    .strict();

/**
 * Create feedback
 */
export const createFeedbackSchema = z
    .object({
        type: feedbackTypeSchema,

        ratings: feedbackRatingsSchema,

        comment: z
            .string()
            .trim()
            .max(5000)
            .optional(),

        problems: z
            .array(feedbackProblemSchema)
            .max(7)
            .optional(),

        featureSuggestion: z
            .string()
            .trim()
            .max(3000)
            .optional(),

        attachments: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1)
            )
            .max(5)
            .optional(),

        metadata: feedbackMetadataSchema.optional(),
    })
    .strict();

/**
 * Feedback ID params
 */
export const feedbackIdParamsSchema = z
    .object({
        feedbackId: z
            .string()
            .trim()
            .min(1, "Feedback ID is required"),
    })
    .strict();

export type CreateFeedbackInput = z.infer<
    typeof createFeedbackSchema
>;