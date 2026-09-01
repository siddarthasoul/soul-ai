
import {
    type ConversationDocument,
    ConversationModel,
} from "../models/conversation.model.js";

import type {
    ChatIdentity,
} from "../../../../packages/common/middlewares/identity.middleware.js";

class ConversationRepository {

    // ======================================================
    // CREATE CONVERSATION
    // ======================================================

    async create(
        identity: ChatIdentity,
        title?: string,
        conversationId?: string
    ): Promise<ConversationDocument> {

        if (identity.userId) {
            return ConversationModel.create({
                ...(conversationId
                    ? { _id: conversationId }
                    : {}),

                owner: {
                    type: "user",
                    userId: identity.userId,
                    guestId: null,
                },

                title: title ?? null,
            });
        }

        if (identity.guestId) {
            return ConversationModel.create({
                ...(conversationId
                    ? { _id: conversationId }
                    : {}),

                owner: {
                    type: "guest",
                    userId: null,
                    guestId: identity.guestId,
                },

                title: title ?? null,
            });
        }

        throw new Error("Invalid chat identity");
    }

    // ======================================================
    // FIND ONE
    // ======================================================

    async findByIdAndIdentity(
        conversationId: string,
        identity: ChatIdentity
    ): Promise<ConversationDocument | null> {

        if (identity.userId) {
            return ConversationModel.findOne({
                _id: conversationId,
                "owner.type": "user",
                "owner.userId": identity.userId,
            });
        }

        if (identity.guestId) {
            return ConversationModel.findOne({
                _id: conversationId,
                "owner.type": "guest",
                "owner.guestId": identity.guestId,
            });
        }

        return null;
    }

    // ======================================================
    // FIND ALL
    // ======================================================

    async findAllByIdentity(
        identity: ChatIdentity
    ): Promise<ConversationDocument[]> {

        if (identity.userId) {
            return ConversationModel.find({
                "owner.type": "user",
                "owner.userId": identity.userId,
            }).sort({
                updatedAt: -1,
            });
        }

        if (identity.guestId) {
            return ConversationModel.find({
                "owner.type": "guest",
                "owner.guestId": identity.guestId,
            }).sort({
                updatedAt: -1,
            });
        }

        return [];
    }

    // ======================================================
    // UPDATE LAST MESSAGE
    // ======================================================

    async updateLastMessageAt(
        conversationId: string,
        date: Date = new Date()
    ): Promise<ConversationDocument | null> {

        return ConversationModel.findByIdAndUpdate(
            conversationId,
            {
                lastMessageAt: date,
            },
            {
                returnDocument: "after",
            }
        );
    }

    // ======================================================
    // UPDATE TITLE
    // ======================================================

    async updateTitle(
        conversationId: string,
        title: string
    ): Promise<ConversationDocument | null> {

        return ConversationModel.findByIdAndUpdate(
            conversationId,
            {
                title,
            },
            {
                returnDocument: "after",
            }
        );
    }
}

const conversationRepository =
    new ConversationRepository();

export default conversationRepository;
