import { z } from "zod";


export const createConversationSchema =
    z.object({
        title: z
            .string()
            .trim()
            .min(
                1,
                "Title cannot be empty"
            )
            .max(
                200,
                "Title cannot exceed 200 characters"
            )
            .optional(),
    });


export const conversationIdSchema =
    z.object({
        conversationId: z
            .string()
            .uuid("Invalid conversation ID"),
    });

export const messageIdSchema =
    z.object({
        messageId: z
            .string()
            .regex(
                /^[0-9a-fA-F]{24}$/,
                "Invalid message ID"
            ),
    });


export const messageFeedbackSchema =
    z.object({
        liked: z.boolean(),

        reasons: z
            .array(
                z.enum([
                    "helpful",
                    "relevant",
                    "clear",
                    "good_reasoning",
                    "fast",
                    "incorrect",
                    "not_relevant",
                    "poor_reasoning",
                    "unclear",
                    "incomplete",
                    "too_slow",
                    "other",
                ])
            )
            .max(5)
            .default([]),

        overall: z
            .enum([
                "good",
                "bad",
            ])
            .optional(),

        comment: z
            .string()
            .trim()
            .max(2000)
            .optional(),
    })
    .superRefine(
        (data, ctx) => {

            /**
             * 👍 Positive feedback
             * must have good overall rating.
             */
            if (
                data.liked === true &&
                data.overall === "bad"
            ) {
                ctx.addIssue({
                    code: "custom",
                    path: ["overall"],
                    message:
                        "Positive feedback cannot have a bad overall rating.",
                });
            }

            /**
             * 👎 Negative feedback
             * must have bad overall rating.
             */
            if (
                data.liked === false &&
                data.overall === "good"
            ) {
                ctx.addIssue({
                    code: "custom",
                    path: ["overall"],
                    message:
                        "Negative feedback cannot have a good overall rating.",
                });
            }

            /**
             * Require at least one reason
             * when detailed feedback is submitted.
             */
            if (
                data.liked === false &&
                data.reasons.length === 0
            ) {
                ctx.addIssue({
                    code: "custom",
                    path: ["reasons"],
                    message:
                        "Please select at least one reason for negative feedback.",
                });
            }
        }
    );