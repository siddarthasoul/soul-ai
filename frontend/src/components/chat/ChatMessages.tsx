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

    role:
        | "user"
        | "assistant";

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

    const messagesEndRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });

    }, [
        messages,
        streamingContent,
    ]);

    return (
        <section className="soul-chat-scroll relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-20 sm:px-7 sm:pt-24">

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">

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
                    <div className="mx-auto max-w-xl rounded-2xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3 text-center text-sm text-red-200/60">
                        {error}
                    </div>
                )}

                <div
                    ref={messagesEndRef}
                    className="h-px shrink-0"
                />

            </div>

        </section>
    );
}