"use client";

import {
    useCallback,
    useEffect,
} from "react";

import {
    connectSocket,
    getSocket,
    joinConversation as socketJoinConversation,
    leaveConversation as socketLeaveConversation,
} from "@/src/lib/socket/chat.socket";

import { useChatStore } from "@/src/stores/chat.store";

import type {
    ChatChunkEvent,
    ChatCompleteEvent,
    ChatErrorEvent,
} from "@/src/types/chat";


export function useChatSocket() {

    // ============================================================
    // STORE
    // ============================================================

    const appendStreamingContent =
        useChatStore(
            (state) =>
                state.appendStreamingContent
        );

    const finishStreaming =
        useChatStore(
            (state) =>
                state.finishStreaming
        );

    const setError =
        useChatStore(
            (state) =>
                state.setError
        );

    const setRateLimit =
        useChatStore(
            (state) =>
                state.setRateLimit
        );


    // ============================================================
    // CONNECT
    // ============================================================

    const connect = useCallback(() => {

        return connectSocket();

    }, []);


    // ============================================================
    // JOIN CONVERSATION
    // ============================================================

    const joinConversation =
        useCallback(
            async (
                conversationId: string
            ) => {

                if (!conversationId) {

                    throw new Error(
                        "Conversation ID is required"
                    );
                }

                await socketJoinConversation(
                    conversationId
                );
            },
            []
        );


    // ============================================================
    // LEAVE CONVERSATION
    // ============================================================

    const leaveConversation =
        useCallback(
            (
                conversationId: string
            ) => {

                if (!conversationId) {
                    return;
                }

                socketLeaveConversation(
                    conversationId
                );
            },
            []
        );


    // ============================================================
    // SOCKET EVENTS
    // ============================================================

    useEffect(() => {

        const socket = getSocket();


        // ========================================================
        // AI STREAM CHUNK
        // ========================================================

        const handleChunk = (
            data: ChatChunkEvent
        ) => {

            if (!data?.content) {
                return;
            }

            appendStreamingContent(
                data.content
            );
        };


        // ========================================================
        // AI COMPLETE
        // ========================================================

        const handleComplete = (
            data: ChatCompleteEvent
        ) => {

            if (!data?.messageId) {

                console.error(
                    "[useChatSocket] Missing messageId"
                );

                return;
            }


            // ----------------------------------------------------
            // UPDATE RATE LIMIT
            // ----------------------------------------------------

            if (data.rateLimit) {

                setRateLimit(
                    data.rateLimit
                );
            }


            // ----------------------------------------------------
            // GET STREAMED CONTENT
            // ----------------------------------------------------

            const state =
                useChatStore.getState();

            const content =
                state.streamingContent;


            // ----------------------------------------------------
            // PROTECT AGAINST EMPTY RESPONSE
            // ----------------------------------------------------

            if (!content.trim()) {

                setError(
                    "AI returned an empty response"
                );

                return;
            }


            // ----------------------------------------------------
            // CREATE ASSISTANT MESSAGE
            // ----------------------------------------------------

            finishStreaming({

                id: data.messageId,

                conversationId:
                    data.conversationId,

                userId: null,

                guestId: null,

                role: "assistant",

                content,

                model:
                    data.model ?? null,

                liked: null,

                usage:
                    data.usage ?? null,

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString(),
            });
        };


        // ========================================================
        // CHAT ERROR
        // ========================================================

        const handleError = (
            data: ChatErrorEvent
        ) => {

            console.error(
                "[useChatSocket] CHAT ERROR",
                {
                    code: data.code,
                    message: data.message,
                    conversationId:
                        data.conversationId,
                }
            );


            // ----------------------------------------------------
            // RATE LIMIT
            // ----------------------------------------------------




            // ----------------------------------------------------
            // STORE ERROR
            // ----------------------------------------------------

            setError(
                data.message ||
                    "AI response failed",

                data.code
            );
        };


        // ========================================================
        // REGISTER
        // ========================================================

        socket.on(
            "chat_chunk",
            handleChunk
        );

        socket.on(
            "chat_complete",
            handleComplete
        );

        socket.on(
            "chat_error",
            handleError
        );


        // ========================================================
        // CLEANUP
        // ========================================================

        return () => {

            socket.off(
                "chat_chunk",
                handleChunk
            );

            socket.off(
                "chat_complete",
                handleComplete
            );

            socket.off(
                "chat_error",
                handleError
            );
        };

    }, [
        appendStreamingContent,
        finishStreaming,
        setError,
        setRateLimit,
    ]);


    // ============================================================
    // RETURN
    // ============================================================

    return {

        connect,

        joinConversation,

        leaveConversation,
    };
}


export default useChatSocket;