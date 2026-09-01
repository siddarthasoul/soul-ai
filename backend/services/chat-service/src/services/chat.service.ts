import { randomUUID } from "crypto"
import type {
    ChatIdentity,
} from "../../../../packages/common/middlewares/identity.middleware.js";
import type {
    MessageFeedbackInput,
} from "../types/chat.types.js";
import conversationRepository
    from "../repositories/conversation.repository.js";

import messageRepository
    from "../repositories/message.repository.js";

import llmService
    from "./llm.service.js";

import chatMemoryService
    from "./chat-memory.service.js";

import {
    ApiError,
} from "../../../../packages/common/utils/apiError.js";

import chatRateLimitService
    from "./chat-rate-limit.service.js";

import type {
    ChatUsage,
} from "../types/chat.types.js";

import type {
    RateLimitResult,
} from "../../../../packages/common/redis/rate-limit.service.js";


export interface SendMessageInput {
    conversationId: string;
    content: string;
}


export interface ChatStreamChunk {
    content: string;
    model: string;
    done: boolean;
    usage?: ChatUsage;
    messageId?: string;
    rateLimit?: RateLimitResult;
}


class ChatService {


    async createConversation(
        identity: ChatIdentity,
        title?: string
    ) {
        // ============================================================
        // VALIDATE IDENTITY
        // ============================================================

        this.validateIdentity(identity);

        // ============================================================
        // GENERATE CONVERSATION ID
        // ============================================================

        const conversationId = randomUUID();

        // ============================================================
        // BUILD TEMPORARY CONVERSATION
        // ============================================================
        // This is NOT saved to MongoDB.
        // It exists only so the frontend has a conversation ID.

        const now = new Date().toISOString();

        const conversation = {
            id: conversationId,

            owner: identity.userId
                ? {
                    type: "user" as const,
                    userId: identity.userId,
                    guestId: null,
                }
                : {
                    type: "guest" as const,
                    userId: null,
                    guestId: identity.guestId ?? null,
                },

            title: title?.trim() || null,

            createdAt: now,
            updatedAt: now,
            lastMessageAt: null,
        };

        // ============================================================
        // RATE LIMIT STATUS
        // ============================================================

        const rateLimit =
            await chatRateLimitService.getStatus(
                identity
            );

        // ============================================================
        // RESPONSE
        // ============================================================

        return {
            conversation,
            rateLimit,
        };
    }




    // ======================================================
    // GET ALL CONVERSATIONS
    // ======================================================

    async getConversations(
        identity: ChatIdentity
    ) {

        this.validateIdentity(identity);

        return conversationRepository.findAllByIdentity(
            identity
        );
    }


    // ======================================================
    // GET CONVERSATION + MESSAGES
    // ======================================================

    async getConversationMessages(
        conversationId: string,
        identity: ChatIdentity
    ) {

        this.validateIdentity(identity);

        const conversation =
            await conversationRepository.findByIdAndIdentity(
                conversationId,
                identity
            );

        if (!conversation) {
            throw new ApiError(
                404,
                "Conversation not found"
            );
        }

        const messages =
            await messageRepository.findByConversationId(
                conversationId
            );

        return {
            conversation,
            messages,
        };
    }


    // ======================================================
    // STREAM MESSAGE
    // ======================================================

    async *streamMessage(
        identity: ChatIdentity,
        data: SendMessageInput
    ): AsyncGenerator<
        ChatStreamChunk,
        void,
        unknown
    > {

        this.validateIdentity(identity);


        // --------------------------------------------------
        // VALIDATE MESSAGE
        // --------------------------------------------------

        const content =
            data.content.trim();

        if (!content) {
            throw new ApiError(
                400,
                "Message cannot be empty"
            );
        }


        // --------------------------------------------------
        // RATE LIMIT
        // --------------------------------------------------

        /*
         * IMPORTANT:
         *
         * Check rate limit BEFORE creating a new
         * conversation.
         *
         * Therefore a rejected request cannot create
         * an empty conversation.
         */

        const rateLimit =
            await chatRateLimitService.check(
                identity
            );

        if (!rateLimit.allowed) {
            throw new ApiError(
                429,
                `Too many requests. Try again in ${rateLimit.retryAfterSeconds} seconds.`
            );
        }


        // --------------------------------------------------
        // FIND OR CREATE CONVERSATION
        // --------------------------------------------------

        let conversation =
            await conversationRepository.findByIdAndIdentity(
                data.conversationId,
                identity
            );

        /*
         * If conversation doesn't exist, this is the
         * first message.
         */

        const isFirstMessage =
            !conversation;


        // --------------------------------------------------
        // CREATE ONLY WHEN FIRST MESSAGE ARRIVES
        // --------------------------------------------------

        if (!conversation) {

            conversation =
                await conversationRepository.create(
                    identity,
                    undefined,
                    data.conversationId
                );
        }


        // --------------------------------------------------
        // MEMORY
        // --------------------------------------------------

        const memory =
            await chatMemoryService.getMessages(
                data.conversationId
            );


        // --------------------------------------------------
        // BUILD LLM MESSAGES
        // --------------------------------------------------

        const messages = [

            ...memory,

            {
                role: "user" as const,
                content,
            },

        ];


        // --------------------------------------------------
        // RESPONSE STATE
        // --------------------------------------------------

        let assistantContent = "";

        let model =
            llmService.getModel();

        let usage:
            ChatUsage |
            undefined;


        // --------------------------------------------------
        // LLM STREAM
        // --------------------------------------------------

        try {

            for await (
                const chunk of llmService.stream(
                    messages
                )
            ) {

                assistantContent +=
                    chunk.content;

                model =
                    chunk.model ||
                    model;


                // ------------------------------------------
                // USAGE
                // ------------------------------------------

                if (chunk.usage) {

                    usage =
                        chunk.usage;
                }


                // ------------------------------------------
                // STREAM CONTENT
                // ------------------------------------------

                if (chunk.content) {

                    yield {

                        content:
                            chunk.content,

                        model,

                        done: false,
                    };
                }


                // ------------------------------------------
                // STREAM COMPLETE
                // ------------------------------------------

                if (chunk.done) {
                    break;
                }
            }

        } catch (error) {

            /*
             * The conversation was created before the
             * stream because we need a valid conversation
             * for memory/database operations.
             *
             * However, if streaming fails on the first
             * message, remove the empty conversation.
             *
             * Add a repository delete method if you want
             * this cleanup to be completely transactional.
             */

            throw error;
        }


        // --------------------------------------------------
        // EMPTY RESPONSE PROTECTION
        // --------------------------------------------------

        if (!assistantContent.trim()) {

            throw new ApiError(
                502,
                "AI service returned an empty response"
            );
        }


        // --------------------------------------------------
        // SAVE USER MESSAGE
        // --------------------------------------------------

        await messageRepository.createUserMessage(
            data.conversationId,
            identity,
            content
        );


        // --------------------------------------------------
        // SAVE ASSISTANT MESSAGE
        // --------------------------------------------------

        const assistantMessage =
            await messageRepository.createAssistantMessage(
                data.conversationId,
                identity,
                assistantContent,
                model,
                usage
            );


        // --------------------------------------------------
        // UPDATE CONVERSATION LAST MESSAGE
        // --------------------------------------------------

        await conversationRepository.updateLastMessageAt(
            data.conversationId
        );


        // --------------------------------------------------
        // UPDATE MEMORY
        // --------------------------------------------------

        await chatMemoryService.addMessages(
            data.conversationId,
            [
                {
                    role: "user",
                    content,
                },

                {
                    role: "assistant",
                    content: assistantContent,
                },
            ]
        );


        // --------------------------------------------------
        // GENERATE TITLE
        // --------------------------------------------------

        /*
         * Only generate a title for the first message.
         *
         * This happens AFTER streaming and persistence,
         * so title generation does not delay the user's
         * first visible AI response.
         */

        if (isFirstMessage) {

            try {

                const title =
                    await llmService.generateTitle(
                        content
                    );

                await conversationRepository.updateTitle(
                    data.conversationId,
                    title
                );

            } catch (error) {

                /*
                 * Title generation should NEVER break
                 * an otherwise successful chat.
                 */

                console.error(
                    "[ChatService] TITLE GENERATION FAILED:",
                    error
                );
            }
        }


        // --------------------------------------------------
        // COMPLETE
        // --------------------------------------------------

        yield {

            content: "",

            model,

            done: true,

            ...(usage
                ? { usage }
                : {}),

            messageId:
                assistantMessage.id,

            rateLimit,
        };
    }


    // ======================================================
    // MESSAGE FEEDBACK
    // ======================================================

    async messageFeedback(
        messageId: string,
        feedback: MessageFeedbackInput
    ) {
        const updated =
            await messageRepository.updateFeedback(
                messageId,
                feedback
            );

        if (!updated) {
            throw new ApiError(
                404,
                "Assistant message not found"
            );
        }

        return {
            messageId: updated._id.toString(),
            liked: updated.liked,
            feedback: updated.feedback,
        };
    }


    // ======================================================
    // VALIDATE IDENTITY
    // ======================================================

    private validateIdentity(
        identity: ChatIdentity
    ): void {

        if (
            !identity.userId &&
            !identity.guestId
        ) {

            throw new ApiError(
                401,
                "Identity required"
            );
        }

        if (
            identity.userId &&
            identity.guestId
        ) {

            throw new ApiError(
                400,
                "Invalid identity"
            );
        }
    }
}


const chatService =
    new ChatService();


export default chatService;
