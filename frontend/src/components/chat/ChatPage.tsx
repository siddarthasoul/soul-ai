"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import SoulBackground from "../landing/SoulBackground";
import SoulActionBubble from "@/src/components/landing/SoulActionBubble";
import ChatHistory from "./ChatHistory";
import ChatStatus from "./ChatStatus";
import ChatMessages from "./ChatMessages";
import ChatComposer from "./ChatComposer";

import useChat from "@/src/hooks/useChat";
import useChatSocket from "@/src/hooks/useChatSocket";

interface ChatPageProps {
    conversationId: string;
}

export default function ChatPage({
    conversationId,
}: ChatPageProps) {
    const router = useRouter();

    const [message, setMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [isJoined, setIsJoined] = useState(false);

    // ============================================================
    // CHAT
    // ============================================================

    const {
        conversations,
        messages,
        sendMessage,
        loadConversations,
        loadConversationMessages,
        isLoadingConversations,
        isLoadingMessages,
        streamingContent,
        messageFeedback,
        isStreaming,
        error,
        rateLimit,
        clearChat,
    } = useChat();

    // ============================================================
    // SOCKET
    // ============================================================

    const {
        connect,
        joinConversation,
        leaveConversation,
    } = useChatSocket();

    // ============================================================
    // AUTH
    // ============================================================

    const openRegister = useCallback(() => {
        router.push("/register");
    }, [router]);

    const openLogin = useCallback(() => {
        router.push("/login");
    }, [router]);

    // ============================================================
    // NEW CHAT
    //
    // IMPORTANT:
    // We create the conversation through backend first.
    // We do NOT generate a random conversation ID here.
    // ============================================================

    const openNewConversation = useCallback(() => {
        clearChat();

        const newConversationId =
            crypto.randomUUID();

        router.push(
            `/chat/${newConversationId}`
        );
    }, [clearChat, router]);

    // ============================================================
    // RATE LIMIT
    // ============================================================

    const isRateLimited =
        rateLimit !== null &&
        rateLimit.remaining <= 0;

    // ============================================================
    // LOAD CONVERSATIONS
    // ============================================================

    useEffect(() => {
        void loadConversations();
    }, [
        loadConversations,
    ]);

    // ============================================================
    // LOAD CURRENT CONVERSATION
    // ============================================================

    useEffect(() => {
        if (!conversationId) {
            return;
        }

        const conversationExists =
            conversations.some(
                (conversation) =>
                    conversation.id === conversationId
            );

        if (!conversationExists) {
            console.log(
                "[ChatPage] Temporary conversation:",
                conversationId
            );

            return;
        }

        void loadConversationMessages(
            conversationId
        );
    }, [
        conversationId,
        conversations,
        loadConversationMessages,
    ]);

    // ============================================================
    // SOCKET CONNECTION
    // ============================================================

    useEffect(() => {
        const socket = connect();

        const handleConnect = () => {
            console.log(
                "[ChatPage] SOCKET CONNECTED:",
                socket.id
            );

            setIsConnected(true);
        };

        const handleDisconnect = (
            reason: string
        ) => {
            console.log(
                "[ChatPage] SOCKET DISCONNECTED:",
                reason
            );

            setIsConnected(false);
            setIsJoined(false);
        };

        const handleConnectError = (
            error: Error
        ) => {
            console.error(
                "[ChatPage] SOCKET CONNECTION ERROR:",
                error.message
            );

            setIsConnected(false);
            setIsJoined(false);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);

        // IMPORTANT:
        // connect() may return an already-connected socket.
        // In that case the "connect" event has already fired.
        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
        };
    }, [connect]);

    // ============================================================
    // JOIN CURRENT CONVERSATION
    //
    // IMPORTANT:
    // Only join after socket is actually connected.
    // ============================================================

    useEffect(() => {
        if (!conversationId) {
            return;
        }

        if (!isConnected) {
            return;
        }

        let cancelled = false;

        const join = async () => {
            try {
                setIsJoined(false);

                console.log(
                    "[ChatPage] JOINING:",
                    conversationId
                );

                await joinConversation(
                    conversationId
                );

                if (cancelled) {
                    return;
                }

                setIsJoined(true);

                console.log(
                    "[ChatPage] JOINED:",
                    conversationId
                );
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "[ChatPage] JOIN FAILED:",
                    error
                );

                setIsJoined(false);
            }
        };

        void join();

        return () => {
            cancelled = true;

            leaveConversation(
                conversationId
            );

            setIsJoined(false);
        };
    }, [
        conversationId,
        isConnected,
        joinConversation,
        leaveConversation,
    ]);

    // ============================================================
    // SEND MESSAGE
    // ============================================================

    const handleSendMessage =
        useCallback(async () => {
            const value = message.trim();

            if (!value) {
                return;
            }

            if (!conversationId) {
                return;
            }

            if (!isConnected) {
                console.warn(
                    "[ChatPage] SOCKET NOT CONNECTED"
                );

                return;
            }

            if (!isJoined) {
                console.warn(
                    "[ChatPage] CONVERSATION NOT JOINED"
                );

                return;
            }

            if (isStreaming) {
                console.warn(
                    "[ChatPage] AI IS STREAMING"
                );

                return;
            }

            if (isRateLimited) {
                console.warn(
                    "[ChatPage] CHAT LIMIT REACHED"
                );

                return;
            }

            // Clear input immediately.
            setMessage("");

            try {
                await sendMessage({
                    conversationId,
                    content: value,
                });
            } catch (error) {
                console.error(
                    "[ChatPage] SEND FAILED:",
                    error
                );

                // Restore message if sending failed.
                setMessage(value);
            }
        }, [
            message,
            conversationId,
            isConnected,
            isJoined,
            isStreaming,
            isRateLimited,
            sendMessage,
        ]);

    // ============================================================
    // STATUS
    // ============================================================

    const online =
        isConnected &&
        isJoined;

    const statusText =
        !isConnected
            ? "Connecting..."
            : !isJoined
                ? "Joining..."
                : isRateLimited
                    ? "Chat limit reached"
                    : isLoadingMessages
                        ? "Loading conversation..."
                        : isStreaming
                            ? "SOUL is thinking..."
                            : "Online";

    // ============================================================
    // UI
    // ============================================================

    return (
        <main className="fixed inset-0 flex h-[100dvh] w-full min-w-0 overflow-hidden bg-black text-white">
            <SoulBackground />

            {/* ============================================================
            HISTORY
        ============================================================ */}

            <ChatHistory
                conversations={conversations}
                activeConversationId={conversationId}
                isLoading={isLoadingConversations}
                onNewChat={openNewConversation}
            />

            {/* ============================================================
            CHAT AREA

            IMPORTANT:
            min-h-0 + overflow-hidden prevents the flex child from
            increasing the height of the whole page.
        ============================================================ */}

            <section className="relative z-10 flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                {/* STATUS */}

                <div className="shrink-0">
                    <ChatStatus
                        online={online}
                        isStreaming={isStreaming}
                        text={statusText}
                    />
                </div>

                {/* ========================================================
                MESSAGES

                This is the ONLY element that should scroll.
            ======================================================== */}

                <ChatMessages
                    messages={messages}
                    streamingContent={streamingContent}
                    isStreaming={isStreaming}
                    error={isRateLimited ? null : error}
                    onFeedback={messageFeedback}
                />

                {/* ========================================================
                RATE LIMIT ACTIONS
            ======================================================== */}

                {isRateLimited && (
                    <div className="flex shrink-0 w-full items-center justify-center gap-4 px-4 pb-4 pt-2 sm:gap-8 sm:pb-6">
                        <SoulActionBubble
                            size="md"
                            label="Sign in"
                            description="Already use SOUL?"
                            status="none"
                            onClick={openLogin}
                        />

                        <SoulActionBubble
                            size="md"
                            label="Unlimited"
                            description="Unlock unlimited chat"
                            status="none"
                            onClick={openRegister}
                        />
                    </div>
                )}

                {/* ========================================================
                COMPOSER

                Composer stays at the bottom.
            ======================================================== */}

                <div className="shrink-0 w-full">
                    <ChatComposer
                        value={message}
                        onChange={setMessage}
                        onSend={handleSendMessage}
                        disabled={
                            !online ||
                            isStreaming ||
                            isRateLimited ||
                            isLoadingMessages
                        }
                        isStreaming={isStreaming}
                        disabledReason={
                            isRateLimited
                                ? "rate-limited"
                                : !isConnected
                                    ? "connecting"
                                    : !isJoined
                                        ? "joining"
                                        : undefined
                        }
                    />
                </div>
            </section>
        </main>
    );
}
