
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
        <section className="fixed inset-0 z-0 h-[100dvh] w-full overflow-hidden bg-black">
            {/* BACKGROUND */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    aria-hidden="true"
                    className="absolute inset-0"
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
            </div>

            {/* BUBBLE AREA */}

            <div className="absolute inset-0 overflow-hidden">

                {/* MAIN SOUL */}

                <div
                    className="
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

                {/* REGISTER */}

                <div
                    className="
                        absolute
                        right-[8vw]
                        top-[16vh]
                        z-20

                        sm:right-[10vw]
                        sm:top-[18vh]

                        lg:right-[14vw]
                        lg:top-[20vh]
                    "
                >
                    <SoulActionBubble
                        size="md"
                        label={
                            authLoading
                                ? "..."
                                : isLoggedIn
                                    ? userLabel
                                    : "Connect"
                        }
                        description={
                            authLoading
                                ? "Checking account"
                                : isLoggedIn
                                    ? "Stay connected"
                                    : "Create your SOUL account"
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

                {/* LOGIN */}

                <div
                    className="
                        absolute
                        left-[8vw]
                        top-[46vh]
                        z-20

                        sm:left-[10vw]
                        sm:top-[48vh]

                        lg:left-[14vw]
                        lg:top-[50vh]
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

                {/* FEEDBACK */}

                <div
                    className="
                        absolute
                        bottom-[12vh]
                        left-[10vw]
                        z-20

                        sm:bottom-[14vh]
                        sm:left-[16vw]

                        lg:bottom-[16vh]
                        lg:left-[22vw]
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

                {/* DECORATIVE BUBBLE */}

                <div
                    className="
                        absolute
                        bottom-[14vh]
                        right-[10vw]
                        z-10

                        sm:bottom-[17vh]
                        sm:right-[16vw]

                        lg:bottom-[20vh]
                        lg:right-[22vw]

                        hidden
                        sm:block
                    "
                >
                    <SoulActionBubble size="sm" />
                </div>

                {/* DECORATIVE BUBBLE */}

                <div
                    className="
                        absolute
                        left-[7vw]
                        top-[20vh]
                        z-10

                        sm:left-[16vw]
                        sm:top-[24vh]

                        lg:left-[22vw]
                        lg:top-[27vh]

                        hidden
                        md:block
                    "
                >
                    <SoulActionBubble size="sm" />
                </div>
            </div>
        </section>
    );
}
