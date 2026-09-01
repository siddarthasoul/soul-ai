import chatApi from "@/src/lib/api/chat.api";
import type {
    MessageFeedbackInput,
} from "@/src/types/feedback.types";
import {
    getSocket,
    sendChatMessage,
} from "@/src/lib/socket/chat.socket";

import type {
    Conversation,
    CreateConversationInput,
    SendMessageInput,
    CreateConversationResponse,
    Message,
} from "@/src/types/chat";


export const chatService = {

    // ======================================================
    // CREATE CONVERSATION
    // ======================================================

    async createConversation(
        input?: CreateConversationInput
    ): Promise<CreateConversationResponse> {

        const response =
            await chatApi.createConversation(input);

        return response.data.data;
    },


    // ======================================================
    // GET ALL CONVERSATIONS
    // ======================================================

    async getConversations(): Promise<Conversation[]> {

        const response =
            await chatApi.getConversations();

        return response.data.data;
    },


    // ======================================================
    // GET CONVERSATION MESSAGES
    // ======================================================

    async getConversationMessages(
        conversationId: string
    ): Promise<{
        conversation: Conversation;
        messages: Message[];
    }> {

        const response =
            await chatApi.getConversationMessages(
                conversationId
            );

        return response.data.data;
    },


    // ======================================================
    // MESSAGE FEEDBACK
    // ======================================================

    async messageFeedback(
        messageId: string,
        feedback: MessageFeedbackInput
    ): Promise<{
        messageId: string;
        liked: boolean;
        feedback: MessageFeedbackInput;
    }> {
        const response =
            await chatApi.messageFeedback(
                messageId,
                feedback
            );

        return response.data.data;
    },


    // ======================================================
    // SEND MESSAGE
    // ======================================================

    sendMessage(
        input: SendMessageInput
    ): void {

        sendChatMessage(
            input.conversationId,
            input.content
        );
    },


    // ======================================================
    // SOCKET
    // ======================================================

    socket() {
        return getSocket();
    },

} as const;


export default chatService;