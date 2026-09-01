import {
    type MessageDocument,
    MessageModel,
} from "../models/message.model.js";

import type {
    ChatUsage,
} from "../types/chat.types.js";

import { type MessageFeedbackInput } from "../types/chat.types.js";

import type {
    ChatIdentity,
} from "../../../../packages/common/middlewares/identity.middleware.js";

class MessageRepository {

    async createUserMessage(
        conversationId: string,
        identity: ChatIdentity,
        content: string
    ): Promise<MessageDocument> {

        this.validateIdentity(identity);

        return MessageModel.create({
            conversationId,

            userId:
                identity.userId ?? null,

            guestId:
                identity.guestId ?? null,

            role: "user",

            content,
        });
    }

    async createAssistantMessage(
        conversationId: string,
        identity: ChatIdentity,
        content: string,
        model: string,
        usage?: ChatUsage
    ): Promise<MessageDocument> {

        this.validateIdentity(identity);

        return MessageModel.create({
            conversationId,

            userId:
                identity.userId ?? null,

            guestId:
                identity.guestId ?? null,

            role: "assistant",

            content,

            model,

            usage: usage ?? null,
        });
    }

    async updateFeedback(
        messageId: string,
        feedback: MessageFeedbackInput
    ): Promise<MessageDocument | null> {
        return MessageModel.findOneAndUpdate(
            {
                _id: messageId,
                role: "assistant",
            },
            {
                $set: {
                    liked: feedback.liked,
                    feedback: {
                        reasons: feedback.reasons ?? [],
                        overall: feedback.overall ?? null,
                        comment: feedback.comment ?? null,
                        submittedAt: new Date(),
                    },
                },
            },
            {
                new: true,
                runValidators: true,
            }
        ).exec();
    }

    async findByConversationId(
        conversationId: string
    ) {
        return MessageModel.find({
            conversationId,
        }).sort({
            createdAt: 1,
        });
    }

    private validateIdentity(
        identity: ChatIdentity
    ): void {

        if (
            !identity.userId &&
            !identity.guestId
        ) {
            throw new Error(
                "Invalid chat identity"
            );
        }

        if (
            identity.userId &&
            identity.guestId
        ) {
            throw new Error(
                "Invalid chat identity"
            );
        }
    }
}

const messageRepository =
    new MessageRepository();

export default messageRepository;