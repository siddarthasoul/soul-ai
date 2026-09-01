import {
    Schema,
    model,
    type HydratedDocument,
    type InferSchemaType,
} from "mongoose";

const messageSchema = new Schema(
    {
        conversationId: {
            type: String,
            required: true,
            index: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true,
        },

        guestId: {
            type: String,
            default: null,
            index: true,
        },

        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
        },

        model: {
            type: String,
            default: null,
        },
        liked: {
            type: Boolean,
            default: null,
            index: true,
        },

        feedback: {
            type: new Schema(
                {
                    reasons: [
                        {
                            type: String,
                            enum: [
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
                            ],
                        },
                    ],

                    overall: {
                        type: String,
                        enum: ["good", "bad"],
                        default: null,
                    },

                    comment: {
                        type: String,
                        trim: true,
                        maxlength: 2000,
                        default: null,
                    },

                    submittedAt: {
                        type: Date,
                        default: null,
                    },
                },
                {
                    _id: false,
                }
            ),
        },
        // ==========================================
        // MODEL PERFORMANCE / USAGE
        // ==========================================

        usage: {
            promptTokens: {
                type: Number,
                default: null,
            },

            completionTokens: {
                type: Number,
                default: null,
            },

            totalTokens: {
                type: Number,
                default: null,
            },

            // Total request time
            totalDurationMs: {
                type: Number,
                default: null,
            },

            // Time required to load model
            loadDurationMs: {
                type: Number,
                default: null,
            },

            // Time spent processing prompt
            promptEvalDurationMs: {
                type: Number,
                default: null,
            },

            // Time spent generating response
            evalDurationMs: {
                type: Number,
                default: null,
            },

            // Tokens generated per second
            tokensPerSecond: {
                type: Number,
                default: null,
            },
        },
    },

    {
        timestamps: true,

        toJSON: {
            transform: (_, ret: Record<string, any>) => {
                ret.id = ret._id.toString();

                delete ret._id;
                delete ret.__v;

                return ret;
            },
        },
    }
);

export type MessageInput =
    InferSchemaType<typeof messageSchema>;

export type MessageDocument =
    HydratedDocument<MessageInput>;

export const MessageModel =
    model<MessageInput>(
        "Message",
        messageSchema
    );