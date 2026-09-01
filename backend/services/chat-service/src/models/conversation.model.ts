import {
    Schema,
    model,
    type HydratedDocument,
    type InferSchemaType,
} from "mongoose";

const conversationSchema = new Schema(
    {

        _id: {
            type: String,
            required: true,
        },
        owner: {
            type: {
                type: String,
                enum: ["user", "guest"],
                required: true,
            },

            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },

            guestId: {
                type: String,
                default: null,
                index: true,
            },
        },

        title: {
            type: String,
            trim: true,
            maxlength: 200,
            default: null,
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


export type ConversationInput =
    InferSchemaType<typeof conversationSchema>;

export type ConversationDocument =
    HydratedDocument<ConversationInput>;

export const ConversationModel =
    model<ConversationInput>(
        "Conversation",
        conversationSchema
    );