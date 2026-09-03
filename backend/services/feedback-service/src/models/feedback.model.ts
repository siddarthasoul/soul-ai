import {
    Schema,
    model,
    type HydratedDocument,
    type InferSchemaType,
} from "mongoose";

/**
 * Rating Schema
 */
const ratingSchema = new Schema(
    {
        // AI Experience
        accuracy: {
            type: Number,
            min: 1,
            max: 5,
        },

        relevance: {
            type: Number,
            min: 1,
            max: 5,
        },

        clarity: {
            type: Number,
            min: 1,
            max: 5,
        },

        completeness: {
            type: Number,
            min: 1,
            max: 5,
        },

        reasoning: {
            type: Number,
            min: 1,
            max: 5,
        },

        formatting: {
            type: Number,
            min: 1,
            max: 5,
        },

        speed: {
            type: Number,
            min: 1,
            max: 5,
        },

        // Chat Experience
        conversationFlow: {
            type: Number,
            min: 1,
            max: 5,
        },

        memory: {
            type: Number,
            min: 1,
            max: 5,
        },

        streaming: {
            type: Number,
            min: 1,
            max: 5,
        },

        composer: {
            type: Number,
            min: 1,
            max: 5,
        },

        // UI / UX
        design: {
            type: Number,
            min: 1,
            max: 5,
        },

        navigation: {
            type: Number,
            min: 1,
            max: 5,
        },

        easeOfUse: {
            type: Number,
            min: 1,
            max: 5,
        },

        responsiveness: {
            type: Number,
            min: 1,
            max: 5,
        },

        animations: {
            type: Number,
            min: 1,
            max: 5,
        },

        // Performance
        pageLoading: {
            type: Number,
            min: 1,
            max: 5,
        },

        stability: {
            type: Number,
            min: 1,
            max: 5,
        },
    },
    {
        _id: false,
    }
);

/**
 * Client metadata
 */
const metadataSchema = new Schema(
    {
        browser: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        os: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        device: {
            type: String,
            enum: [
                "desktop",
                "tablet",
                "mobile",
                "unknown",
            ],
            default: "unknown",
        },

        screenWidth: {
            type: Number,
            min: 0,
        },

        screenHeight: {
            type: Number,
            min: 0,
        },

        appVersion: {
            type: String,
            trim: true,
            maxlength: 50,
        },

        page: {
            type: String,
            trim: true,
            maxlength: 500,
        },
    },
    {
        _id: false,
    }
);

/**
 * Main Feedback Schema
 */
const feedbackSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },

        guestId: {
            type: String,
            default: null,
            index: true,
        },

        type: {
            type: String,
            enum: [
                "general",
                "ai",
                "chat",
                "ui",
                "performance",
                "bug",
                "feature",
            ],
            required: true,
            index: true,
        },

        ratings: {
            type: ratingSchema,
            required: true,
        },

        /**
         * Server calculated overall rating.
         *
         * Never accept this from frontend.
         */
        overall: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },

        comment: {
            type: String,
            trim: true,
            maxlength: 5000,
        },

        problems: [
            {
                type: String,
                enum: [
                    "ai_quality",
                    "ui",
                    "bug",
                    "speed",
                    "chat",
                    "feature",
                    "other",
                ],
            },
        ],

        featureSuggestion: {
            type: String,
            trim: true,
            maxlength: 3000,
        },

        attachments: [
            {
                type: String,
                trim: true,
            },
        ],

        metadata: {
            type: metadataSchema,
        },

        status: {
            type: String,
            enum: [
                "new",
                "reviewing",
                "resolved",
                "closed",
            ],
            default: "new",
            index: true,
        },

        priority: {
            type: String,
            enum: [
                "low",
                "medium",
                "high",
                "critical",
            ],
            default: "medium",
            index: true,
        },

        internalNotes: {
            type: String,
            trim: true,
            maxlength: 5000,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


/**
 * Indexes
 */
feedbackSchema.index({
    userId: 1,
    createdAt: -1,
});

feedbackSchema.index({
    type: 1,
    createdAt: -1,
});

feedbackSchema.index({
    status: 1,
    priority: 1,
    createdAt: -1,
});

feedbackSchema.index({
    overall: -1,
});

/**
 * Types
 */
export type Feedback = InferSchemaType<
    typeof feedbackSchema
>;

export type FeedbackDocument =
    HydratedDocument<Feedback>;

/**
 * Model
 */
const FeedbackModel = model<Feedback>(
    "Feedback",
    feedbackSchema
);

export default FeedbackModel;