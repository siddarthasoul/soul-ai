import apiClient from "./client";

import apiConfig from "@/src/config/api.config";

import { MessageFeedbackInput } from "@/src/types/feedback.types";

import type { ApiResponse } from "@/src/types/api";

import type {
    CreateConversationInput,
    CreateConversationResponse,
    Conversation,
    Message,
} from "@/src/types/chat";


const CHAT_PREFIX =
    `${apiConfig.apiPrefix}/chat`;


export const chatApi = {

    // ======================================================
    // CREATE CONVERSATION
    // ======================================================

    createConversation(
        input?: CreateConversationInput
    ) {
        return apiClient.post<
            ApiResponse<CreateConversationResponse>
        >(
            `${CHAT_PREFIX}/conversations`,
            input ?? {}
        );
    },


    // ======================================================
    // GET ALL CONVERSATIONS
    // ======================================================

    getConversations() {
        return apiClient.get<
            ApiResponse<Conversation[]>
        >(
            `${CHAT_PREFIX}/conversations`
        );
    },


    // ======================================================
    // GET CONVERSATION MESSAGES
    // ======================================================

    getConversationMessages(
        conversationId: string
    ) {
        return apiClient.get<
            ApiResponse<{
                conversation: Conversation;
                messages: Message[];
            }>
        >(
            `${CHAT_PREFIX}/conversations/${conversationId}/messages`
        );
    },


    // ======================================================
    // MESSAGE FEEDBACK
    // ======================================================

    messageFeedback(
        messageId: string,
        feedback: MessageFeedbackInput
    ) {
        return apiClient.post<
            ApiResponse<{
                messageId: string;
                liked: boolean;
                feedback: MessageFeedbackInput;
            }>
        >(
            `${CHAT_PREFIX}/messages/${messageId}/feedback`,
            feedback
        );
    },
} as const;


export default chatApi;