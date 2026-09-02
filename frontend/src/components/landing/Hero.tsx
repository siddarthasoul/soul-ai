
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

    const [chatLoading, setChatLoading] = useState(false);
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const setRateLimit = useChatStore(
        (state) => state.setRateLimit
    );

    const clearChat = useChatStore(
        (state) => state.clearChat
    );

    useEffect(() => {
        let mounted = true;

        const checkAuth = async () => {
            try {
                const response = await apiClient.get(
                    "/api/v1/users/me"
                );

                const currentUser = response.data?.data;

                if (!mounted) return;

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

    const isLoggedIn = Boolean(user);

    const userLabel =
        user?.name?.trim() ||
        user?.email?.split("@")[0] ||
        "You";

    const openChat = async () => {
        if (chatLoading) return;

        try {
            setChatLoading(true);

            clearChat();

            const result =
                await chatService.createConversation();

            const conversation = result.conversation;

            if (!conversation?.id) {
                throw new Error(
                    "Conversation ID was not returned"
                );
            }

            if (result.rateLimit) {
                setRateLimit(result.rateLimit);
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

    const openRegister = () => {
        router.push("/register");
    };

    const openLogin = () => {
        router.push("/login");
    };

    return (
        <section className="relative h-full w-full overflow-hidden">

            {/* COLOR FIELD */}

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="soul-color-field">
                    <div className="soul-color soul-color-violet" />
                    <div className="soul-color soul-color-cyan" />
                    <div className="soul-color soul-color-pink" />
                </div>

                <div
                    className="
                        soul-liquid-glow
                        soul-liquid-blue
                        -left-32
                        top-1/4
                    "
                />

                <div
                    className="
                        soul-liquid-glow
                        soul-liquid-purple
                        -right-40
                        top-1/3
                    "
                />

                <div
                    className="
                        soul-liquid-glow
                        soul-liquid-pink
                        bottom-[-180px]
                        left-1/2
                    "
                />
            </div>

            {/* BUBBLE CANVAS */}

            <div className="absolute inset-0 overflow-hidden">

                {/* MAIN SOUL */}

                <div
                    className="
                        soul-action-position
                        soul-bubble-main
                        absolute
                        left-1/2
                        top-1/2
                        z-30
                        -translate-x-1/2
                        -translate-y-1/2
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

                {/* DECORATIVE 1 */}

                <div
                    className="
                        soul-action-position
                        soul-bubble-one
                        absolute
                        left-[8%]
                        top-[22%]
                        z-10
                    "
                >
                    <SoulActionBubble size="sm" />
                </div>

                {/* REGISTER / USER */}

                <div
                    className="
                        soul-action-position
                        soul-bubble-two
                        absolute
                        right-[9%]
                        top-[18%]
                        z-20
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

                {/* FEEDBACK */}

                <div
                    className="
                        soul-action-position
                        soul-bubble-three
                        absolute
                        bottom-[16%]
                        left-[10%]
                        z-20
                    "
                >
                    <SoulActionBubble
                        size="md"
                        label="Feedback"
                        description="Share your experience"
                        onClick={() =>
                            router.push("/feedback")
                        }
                    />
                </div>

                {/* DECORATIVE 2 */}

                <div
                    className="
                        soul-action-position
                        soul-bubble-four
                        absolute
                        bottom-[18%]
                        right-[8%]
                        z-10
                    "
                >
                    <SoulActionBubble size="sm" />
                </div>

                {/* LOGIN */}

                <div
                    className="
                        soul-action-position
                        soul-bubble-five
                        absolute
                        left-[7%]
                        top-[48%]
                        z-20
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

                {/* DECORATIVE 3 */}

                <div
                    className="
                        soul-action-position
                        soul-bubble-six
                        absolute
                        right-[7%]
                        top-[50%]
                        z-10
                    "
                >
                    <SoulActionBubble size="md" />
                </div>
            </div>
        </section>
    );
}
