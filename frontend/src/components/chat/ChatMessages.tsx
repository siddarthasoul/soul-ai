"use client";

import {
    useEffect,
    useRef,
} from "react";

import ChatMessage from "./ChatMessage";
import StreamingMessage from "./StreamingMessage";

import type {
    MessageFeedbackInput,
    MessageFeedbackReason,
} from "@/src/types/feedback.types";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    liked?: boolean | null;
    feedback?: {
        reasons?: MessageFeedbackReason[];
        overall?: "good" | "bad";
        comment?: string;
    } | null;
}

interface ChatMessagesProps {
    messages: Message[];
    streamingContent: string;
    isStreaming: boolean;
    error: string | null;

    onFeedback: (
        messageId: string,
        feedback: MessageFeedbackInput
    ) => Promise<unknown> | void;
}

export default function ChatMessages({
    messages,
    streamingContent,
    isStreaming,
    error,
    onFeedback,
}: ChatMessagesProps) {
    const scrollRef =
        useRef<HTMLElement | null>(null);

    const previousMessageCount =
        useRef(messages.length);

    useEffect(() => {
        const container =
            scrollRef.current;

        if (!container) {
            return;
        }

        /*
         * Only automatically scroll when:
         *
         * 1. A new message was added
         * 2. User is already near the bottom
         *
         * We DON'T use scrollIntoView().
         * That can move the entire page.
         */

        const wasNearBottom =
            container.scrollHeight -
                container.scrollTop -
                container.clientHeight <
            160;

        const newMessageAdded =
            messages.length >
            previousMessageCount.current;

        previousMessageCount.current =
            messages.length;

        if (newMessageAdded || wasNearBottom) {
            container.scrollTop =
                container.scrollHeight;
        }
    }, [
        messages,
        streamingContent,
    ]);

    return (
        <section
            ref={scrollRef}
            className="
                relative
                z-10
                min-h-0
                flex-1
                overflow-x-hidden
                overflow-y-auto
                overscroll-contain
                px-4
                pb-6
                pt-20

                sm:px-7
                sm:pb-8
                sm:pt-24
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    w-full
                    min-w-0
                    max-w-3xl
                    flex-col
                    gap-8
                "
            >
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                        onFeedback={onFeedback}
                    />
                ))}

                {isStreaming && (
                    <StreamingMessage
                        content={streamingContent}
                    />
                )}

                {error && (
                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-xl
                            rounded-2xl
                            border
                            border-red-400/10
                            bg-red-400/[0.04]
                            px-4
                            py-3
                            text-center
                            text-sm
                            text-red-200/60
                        "
                    >
                        {error}
                    </div>
                )}

                <div className="h-4 shrink-0" />
            </div>
        </section>
    );
}