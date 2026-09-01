
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SoulActionBubble from "@/src/components/landing/SoulActionBubble";

import chatService from "@/src/services/chat.service";

import apiClient from "@/src/lib/api/client";

import { useChatStore } from "@/src/stores/chat.store";

interface CurrentUser {
    id: string;
    name?: string;
    email?: string;
}

export default function Hero() {
    const router = useRouter();

    const [chatLoading, setChatLoading] =
        useState(false);

    const [user, setUser] =
        useState<CurrentUser | null>(null);

    const [authLoading, setAuthLoading] =
        useState(true);

    const setRateLimit =
        useChatStore(
            (state) => state.setRateLimit
        );

    const clearChat =
        useChatStore(
            (state) => state.clearChat
        );

    /*
     * ------------------------------------------------------------
     * AUTHENTICATION
     * ------------------------------------------------------------
     */

    useEffect(() => {
        let mounted = true;

        const checkAuth = async () => {
            try {
                const response =
                    await apiClient.get(
                        "/api/v1/users/me"
                    );

                const currentUser =
                    response.data?.data;

                if (!mounted) {
                    return;
                }

                if (currentUser) {
                    setUser({
                        id: currentUser.id,
                        name: currentUser.name,
                        email: currentUser.email,
                    });
                } else {
                    setUser(null);
                }
            } catch {
                if (mounted) {
                    setUser(null);
                }
            } finally {
                if (mounted) {
                    setAuthLoading(false);
                }
            }
        };

        void checkAuth();

        return () => {
            mounted = false;
        };
    }, []);

    const isLoggedIn =
        Boolean(user);

    const userLabel =
        user?.name?.trim() ||
        user?.email?.split("@")[0] ||
        "You";

    /*
     * ------------------------------------------------------------
     * CREATE CHAT
     * ------------------------------------------------------------
     *
     * IMPORTANT:
     *
     * Conversation creation does NOT consume the limit.
     *
     * Backend returns:
     *
     * {
     *   conversation,
     *   rateLimit
     * }
     *
     * We store rateLimit before opening ChatPage.
     *
     * Therefore ChatPage already knows whether the user
     * has messages remaining.
     */

    const openChat = async () => {
        if (chatLoading) {
            return;
        }

        try {
            setChatLoading(true);

            // Clear previous conversation messages
            // from frontend memory.
            clearChat();

            const result =
                await chatService.createConversation();

            const conversation =
                result.conversation;

            if (!conversation?.id) {
                throw new Error(
                    "Conversation ID was not returned"
                );
            }

            if (result.rateLimit) {
                setRateLimit(
                    result.rateLimit
                );
            }

            router.push(
                `/chat/${conversation.id}`
            );

        } catch (error) {
            console.error(
                "[Hero] Failed to start chat:",
                error
            );
        } finally {
            setChatLoading(false);
        }
    };

    /*
     * ------------------------------------------------------------
     * AUTH NAVIGATION
     * ------------------------------------------------------------
     */

    const openRegister = () => {
        router.push("/register");
    };

    const openLogin = () => {
        router.push("/login");
    };

    /*
     * ------------------------------------------------------------
     * UI
     * ------------------------------------------------------------
     */

    return (
        <main className="relative min-h-dvh overflow-hidden">
            <div
                aria-hidden="true"
                className="soul-color-field"
            >
                <div className="soul-color soul-color-violet" />
                <div className="soul-color soul-color-cyan" />
                <div className="soul-color soul-color-pink" />
            </div>

            <div
                aria-hidden="true"
                className="
                    soul-liquid-glow
                    soul-liquid-blue
                    -left-32
                    top-1/4
                "
            />

            <div
                aria-hidden="true"
                className="
                    soul-liquid-glow
                    soul-liquid-purple
                    -right-40
                    top-1/3
                "
            />

            <div
                aria-hidden="true"
                className="
                    soul-liquid-glow
                    soul-liquid-pink
                    bottom-[-180px]
                    left-1/2
                "
            />

            <section className="relative min-h-dvh w-full">

                {/* MAIN CHAT */}
                <div
                    className="
                        soul-action-position
                        soul-bubble-main
                    "
                >
                    <SoulActionBubble
                        size="lg"
                        label={
                            chatLoading
                                ? "Starting..."
                                : "Chat with SOUL"
                        }
                        description={
                            chatLoading
                                ? "Creating your conversation"
                                : "Start a conversation"
                        }
                        onClick={openChat}
                    />
                </div>

                {/* DECORATIVE */}
                <div
                    className="
                        soul-action-position
                        soul-bubble-one
                    "
                >
                    <SoulActionBubble size="sm" />
                </div>

                {/* ACCOUNT / UNLIMITED */}
                <div
                    className="
                        soul-action-position
                        soul-bubble-two
                    "
                >
                    <SoulActionBubble
                        size="md"
                        label={
                            authLoading
                                ? "..."
                                : isLoggedIn
                                    ? userLabel
                                    : "Unlimited"
                        }
                        description={
                            authLoading
                                ? "Checking account"
                                : isLoggedIn
                                    ? "Unlimited chat"
                                    : "Unlock unlimited chat"
                        }
                        onClick={
                            authLoading
                                ? undefined
                                : isLoggedIn
                                    ? undefined
                                    : openRegister
                        }
                    />
                </div>

                {/* LEARN */}
                <div
                    className="
                        soul-action-position
                        soul-bubble-three
                    "
                >
                    <SoulActionBubble
                        size="md"
                        label="Feedback"
                        description="Share your experience"
                        onClick={() => router.push("/feedback")}
                    />
                </div>

                {/* DECORATIVE */}
                <div
                    className="
                        soul-action-position
                        soul-bubble-four
                    "
                >
                    <SoulActionBubble size="sm" />
                </div>

                {/* LOGIN / ACCOUNT */}
                <div
                    className="
                        soul-action-position
                        soul-bubble-five
                    "
                >
                    <SoulActionBubble
                        size="md"
                        label={
                            authLoading
                                ? "..."
                                : isLoggedIn
                                    ? "Signed in"
                                    : "Sign in"
                        }
                        description={
                            authLoading
                                ? "Checking account"
                                : isLoggedIn
                                    ? "Your SOUL account"
                                    : "Already use SOUL?"
                        }
                        status={
                            isLoggedIn
                                ? "online"
                                : "none"
                        }
                        onClick={
                            authLoading
                                ? undefined
                                : isLoggedIn
                                    ? undefined
                                    : openLogin
                        }
                    />
                </div>

                {/* DECORATIVE */}
                <div
                    className="
                        soul-action-position
                        soul-bubble-six
                    "
                >
                    <SoulActionBubble size="md" />
                </div>

            </section>
        </main>
    );
}
