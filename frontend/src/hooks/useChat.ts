"use client";

import { useCallback } from "react";
import type {
    MessageFeedbackInput,
} from "@/src/types/feedback.types";
import chatService from "@/src/services/chat.service";

import { useChatStore } from "@/src/stores/chat.store";

import type {
    CreateConversationInput,
    SendMessageInput,
} from "@/src/types/chat";


export function useChat() {

    // ============================================================
    // STATE
    // ============================================================

    const conversations = useChatStore(
        (state) => state.conversations
    );

    const activeConversation = useChatStore(
        (state) => state.activeConversation
    );

    const messages = useChatStore(
        (state) => state.messages
    );

    const streamingContent = useChatStore(
        (state) => state.streamingContent
    );

    const isStreaming = useChatStore(
        (state) => state.isStreaming
    );

    const isLoadingConversations =
        useChatStore(
            (state) =>
                state.isLoadingConversations
        );

    const isLoadingMessages =
        useChatStore(
            (state) =>
                state.isLoadingMessages
        );

    const error = useChatStore(
        (state) => state.error
    );

    const rateLimit = useChatStore(
        (state) => state.rateLimit
    );


    // ============================================================
    // ACTIONS
    // ============================================================

    const setConversations =
        useChatStore(
            (state) =>
                state.setConversations
        );


    const setActiveConversation =
        useChatStore(
            (state) =>
                state.setActiveConversation
        );

    const setMessages =
        useChatStore(
            (state) =>
                state.setMessages
        );

    const addMessage =
        useChatStore(
            (state) =>
                state.addMessage
        );

    const startStreaming =
        useChatStore(
            (state) =>
                state.startStreaming
        );

    const setRateLimit =
        useChatStore(
            (state) =>
                state.setRateLimit
        );

    const setLoadingConversations =
        useChatStore(
            (state) =>
                state.setLoadingConversations
        );

    const setLoadingMessages =
        useChatStore(
            (state) =>
                state.setLoadingMessages
        );

    const setError =
        useChatStore(
            (state) =>
                state.setError
        );


    const clearChat = useChatStore(
        (state) => state.clearChat
    );


    // ============================================================
    // CREATE CONVERSATION
    // ============================================================

    const createConversation =
        useCallback(
            async (
                input?: CreateConversationInput
            ) => {
                const result =
                    await chatService.createConversation(
                        input
                    );

                // This is only a temporary conversation.
                // It is NOT saved in MongoDB yet.
                setRateLimit(
                    result.rateLimit
                );

                return result.conversation;
            },
            [setRateLimit]
        );


    // ============================================================
    // LOAD ALL CONVERSATIONS
    // ============================================================

    const loadConversations =
        useCallback(
            async () => {

                try {

                    setLoadingConversations(
                        true
                    );

                    setError(null);

                    const result =
                        await chatService
                            .getConversations();

                    setConversations(
                        result
                    );

                    return result;

                } catch (error) {

                    console.error(
                        "[useChat] FAILED TO LOAD CONVERSATIONS:",
                        error
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load conversations"
                    );

                    return [];

                } finally {

                    setLoadingConversations(
                        false
                    );
                }
            },
            [
                setConversations,
                setLoadingConversations,
                setError,
            ]
        );


    // ============================================================
    // LOAD CONVERSATION MESSAGES
    // ============================================================

    const loadConversationMessages =
        useCallback(
            async (
                conversationId: string
            ) => {

                if (!conversationId) {
                    return null;
                }

                try {

                    setLoadingMessages(
                        true
                    );

                    setError(null);

                    const result =
                        await chatService
                            .getConversationMessages(
                                conversationId
                            );

                    // Set conversation
                    setActiveConversation(
                        result.conversation
                    );

                    // Replace current messages
                    // with backend history.
                    setMessages(
                        result.messages
                    );

                    return result;

                } catch (error) {

                    console.error(
                        "[useChat] FAILED TO LOAD MESSAGES:",
                        error
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load conversation"
                    );

                    return null;

                } finally {

                    setLoadingMessages(
                        false
                    );
                }
            },
            [
                setActiveConversation,
                setMessages,
                setLoadingMessages,
                setError,
            ]
        );


    // ============================================================
    // SEND MESSAGE
    // ============================================================

    const sendMessage =
        useCallback(
            async (
                input: SendMessageInput
            ) => {

                const content =
                    input.content.trim();

                if (!content) {
                    return;
                }

                // ------------------------------------------------
                // PREVENT MULTIPLE STREAMS
                // ------------------------------------------------

                if (
                    useChatStore
                        .getState()
                        .isStreaming
                ) {

                    console.warn(
                        "[useChat] AI IS STREAMING"
                    );

                    return;
                }


                // ------------------------------------------------
                // FRONTEND RATE LIMIT CHECK
                // ------------------------------------------------

                const currentRateLimit =
                    useChatStore
                        .getState()
                        .rateLimit;

                if (
                    currentRateLimit &&
                    currentRateLimit.remaining <= 0
                ) {

                    console.warn(
                        "[useChat] RATE LIMIT REACHED"
                    );

                    return;
                }


                // ------------------------------------------------
                // ADD USER MESSAGE TO CURRENT UI
                // ------------------------------------------------

                const now =
                    new Date().toISOString();

                addMessage({
                    id: crypto.randomUUID(),

                    conversationId:
                        input.conversationId,

                    userId: null,

                    guestId: null,

                    role: "user",

                    content,

                    model: null,

                    usage: null,

                    liked: null,

                    createdAt: now,

                    updatedAt: now,
                });


                // ------------------------------------------------
                // START STREAMING
                // ------------------------------------------------

                startStreaming();


                // ------------------------------------------------
                // SEND THROUGH SOCKET
                // ------------------------------------------------

                try {

                    console.log(
                        "[useChat] SEND MESSAGE:",
                        input.conversationId,
                        content
                    );

                    chatService.sendMessage({
                        conversationId:
                            input.conversationId,

                        content,
                    });

                } catch (error) {

                    console.error(
                        "[useChat] SEND FAILED:",
                        error
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to send message"
                    );
                }
            },
            [
                addMessage,
                startStreaming,
                setError,
            ]
        );


    // ============================================================
    // MESSAGE FEEDBACK
    // ============================================================

    const messageFeedback = useCallback(
        async (
            messageId: string,
            feedback: MessageFeedbackInput
        ) => {
            try {
                const result =
                    await chatService.messageFeedback(
                        messageId,
                        feedback
                    );

                const currentMessages =
                    useChatStore.getState().messages;

                setMessages(
                    currentMessages.map((message) =>
                        message.id === messageId
                            ? {
                                ...message,
                                liked: result.liked,
                                feedback: result.feedback,
                            }
                            : message
                    )
                );

                return result;

            } catch (error) {
                console.error(
                    "[useChat] FEEDBACK FAILED:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to save feedback"
                );

                throw error;
            }
        },
        [setMessages, setError]
    );


    // ============================================================
    // SELECT CONVERSATION
    // ============================================================

    const selectConversation =
        useCallback(
            (
                conversation:
                    typeof activeConversation
            ) => {

                setActiveConversation(
                    conversation
                );
            },
            [
                setActiveConversation,
            ]
        );


    // ============================================================
    // RETURN
    // ============================================================

    return {

        // State
        conversations,

        activeConversation,

        messages,

        streamingContent,

        isStreaming,

        isLoadingConversations,

        isLoadingMessages,

        error,

        rateLimit,

        // Conversation
        createConversation,

        loadConversations,

        loadConversationMessages,

        selectConversation,

        // Message
        sendMessage,

        messageFeedback,
        clearChat,
    };
}


export default useChat;