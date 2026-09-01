
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Conversation } from "@/src/types/chat";

interface ChatHistoryProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    isLoading: boolean;
    onNewChat: () => void;
}

export default function ChatHistory({
    conversations,
    activeConversationId,
    isLoading,
    onNewChat,
}: ChatHistoryProps) {
    const router = useRouter();

    const [isVisible, setIsVisible] = useState(false);

    // ============================================================
    // SELECT EXISTING CONVERSATION
    // ============================================================

    const handleSelect = (
        conversationId: string
    ) => {
        if (!conversationId) {
            return;
        }

        setIsVisible(false);

        router.push(
            `/chat/${conversationId}`
        );
    };

    // ============================================================
    // NEW CHAT
    // ============================================================

    const handleNewChat = () => {
        setIsVisible(false);

        onNewChat();
    };

    return (
        <>
            {/* =====================================================
                SIDEBAR TOGGLE
            ===================================================== */}

            <button
                type="button"
                onClick={() =>
                    setIsVisible(
                        (value) => !value
                    )
                }
                aria-label={
                    isVisible
                        ? "Hide conversations"
                        : "Show conversations"
                }
                aria-expanded={isVisible}
                className="
                    fixed
                    left-4
                    top-24
                    z-[60]
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/[0.10]
                    bg-black/50
                    text-white/60
                    shadow-[0_8px_30px_rgba(0,0,0,0.35)]
                    backdrop-blur-2xl
                    transition-all
                    duration-200
                    hover:border-white/[0.18]
                    hover:bg-white/[0.08]
                    hover:text-white
                    active:scale-95
                "
            >
                <span className="text-xl leading-none">
                    {isVisible ? "‹" : "›"}
                </span>
            </button>

            {/* =====================================================
                BACKDROP
            ===================================================== */}

            {isVisible && (
                <button
                    type="button"
                    aria-label="Close conversation history"
                    onClick={() =>
                        setIsVisible(false)
                    }
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/30
                        backdrop-blur-[2px]
                        md:hidden
                    "
                />
            )}

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-50
                    flex
                    h-dvh
                    w-[280px]
                    flex-col
                    border-r
                    border-white/[0.07]
                    bg-black/65
                    shadow-[20px_0_60px_rgba(0,0,0,0.25)]
                    backdrop-blur-2xl
                    transition-transform
                    duration-300
                    ease-out
                    ${isVisible
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >
                {/* =================================================
                    TOP SPACING
                ================================================= */}

                <div className="h-20 shrink-0" />

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-white/[0.06]
                        px-5
                        py-4
                    "
                >
                    <div className="min-w-0">
                        <div
                            className="
                                ml-22
                                text-[10px]
                                font-semibold
                                tracking-[0.25em]
                                text-cyan-200/40
                            "
                        >
                            SOUL
                        </div>

                        <div
                            className="
                                mt-1
                                ml-15
                                text-sm
                                font-medium
                                text-white/80
                            "
                        >
                            Conversations
                        </div>
                    </div>

                    {/* NEW CHAT */}

                    <button
                        type="button"
                        onClick={
                            handleNewChat
                        }
                        aria-label="New conversation"
                        className="
                            flex
                            size-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/[0.10]
                            bg-white/[0.04]
                            text-lg
                            text-white/50
                            transition-all
                            duration-200
                            hover:border-white/[0.18]
                            hover:bg-white/[0.09]
                            hover:text-white
                            active:scale-95
                        "
                    >
                        +
                    </button>
                </div>

                {/* =================================================
                    HISTORY
                ================================================= */}

                <div
                    className="
                        soul-history-scroll
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-3
                        pb-8
                        pt-4
                    "
                >
                    {/* LOADING */}

                    {isLoading && (
                        <div
                            className="
                                px-3
                                py-5
                                text-sm
                                text-white/30
                            "
                        >
                            Loading conversations...
                        </div>
                    )}

                    {/* EMPTY */}

                    {!isLoading &&
                        conversations.length === 0 && (
                            <div
                                className="
                                    px-4
                                    py-12
                                    text-center
                                    text-sm
                                    leading-6
                                    text-white/25
                                "
                            >
                                No conversations yet.
                                <br />
                                Start a new chat.
                            </div>
                        )}

                    {/* CONVERSATIONS */}

                    {!isLoading &&
                        conversations.map(
                            (conversation) => {
                                const active =
                                    conversation.id ===
                                    activeConversationId;

                                return (
                                    <button
                                        key={
                                            conversation.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleSelect(
                                                conversation.id
                                            )
                                        }
                                        className={`
                                            group
                                            mb-1
                                            w-full
                                            rounded-xl
                                            border
                                            px-3
                                            py-3
                                            text-left
                                            transition-all
                                            duration-200
                                            ${active
                                                ? "border-white/[0.08] bg-white/[0.08] text-white"
                                                : "border-transparent text-white/45 hover:border-white/[0.05] hover:bg-white/[0.045] hover:text-white/80"
                                            }
                                        `}
                                    >
                                        <div
                                            className="
                                                truncate
                                                text-sm
                                                font-medium
                                            "
                                        >
                                            {
                                                conversation.title
                                            }
                                        </div>

                                        <div
                                            className="
                                                mt-1.5
                                                text-[10px]
                                                tracking-wide
                                                text-white/20
                                                group-hover:text-white/30
                                            "
                                        >
                                            {formatDate(
                                                conversation.updatedAt
                                            )}
                                        </div>
                                    </button>
                                );
                            }
                        )}
                </div>
            </aside>
        </>
    );
}

// ============================================================
// DATE
// ============================================================

function formatDate(
    value: string
): string {
    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
        }
    );
}
