"use client";

import { useState } from "react";

import MessageContent from "./MessageContent";
import SoulCore from "./SoulCore";

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

interface ChatMessageProps {
    message: Message;

    onFeedback: (
        messageId: string,
        feedback: MessageFeedbackInput
    ) => Promise<unknown> | void;
}

const positiveReasons: {
    value: MessageFeedbackReason;
    label: string;
}[] = [
    {
        value: "helpful",
        label: "Helpful",
    },
    {
        value: "relevant",
        label: "Relevant",
    },
    {
        value: "clear",
        label: "Clear",
    },
    {
        value: "good_reasoning",
        label: "Good reasoning",
    },
    {
        value: "fast",
        label: "Fast",
    },
];

const negativeReasons: {
    value: MessageFeedbackReason;
    label: string;
}[] = [
    {
        value: "incorrect",
        label: "Incorrect",
    },
    {
        value: "not_relevant",
        label: "Not relevant",
    },
    {
        value: "poor_reasoning",
        label: "Poor reasoning",
    },
    {
        value: "unclear",
        label: "Unclear",
    },
    {
        value: "incomplete",
        label: "Incomplete",
    },
    {
        value: "too_slow",
        label: "Too slow",
    },
    {
        value: "other",
        label: "Other",
    },
];

export default function ChatMessage({
    message,
    onFeedback,
}: ChatMessageProps) {
    const isUser = message.role === "user";

    const [feedbackOpen, setFeedbackOpen] =
        useState(false);

    const [selectedLiked, setSelectedLiked] =
        useState<boolean | null>(null);

    const [selectedReasons, setSelectedReasons] =
        useState<MessageFeedbackReason[]>(
            message.feedback?.reasons ?? []
        );

    const [comment, setComment] = useState(
        message.feedback?.comment ?? ""
    );

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    // ============================================================
    // OPEN FEEDBACK
    // ============================================================

    const openFeedback = (liked: boolean) => {
        setSelectedLiked(liked);
        setSelectedReasons([]);
        setComment("");
        setError(null);
        setFeedbackOpen(true);
    };

    // ============================================================
    // CLOSE FEEDBACK
    // ============================================================

    const closeFeedback = () => {
        if (submitting) {
            return;
        }

        setFeedbackOpen(false);
        setSelectedLiked(null);
        setSelectedReasons([]);
        setComment("");
        setError(null);
    };

    // ============================================================
    // SELECT REASON
    // ============================================================

    const toggleReason = (
        reason: MessageFeedbackReason
    ) => {
        setSelectedReasons((current) => {
            if (current.includes(reason)) {
                return current.filter(
                    (item) => item !== reason
                );
            }

            if (current.length >= 5) {
                return current;
            }

            return [...current, reason];
        });
    };

    // ============================================================
    // SUBMIT
    // ============================================================

    const submitFeedback = async () => {
        if (selectedLiked === null) {
            return;
        }

        if (selectedReasons.length === 0) {
            setError(
                "Please select at least one reason."
            );

            return;
        }

        setSubmitting(true);
        setError(null);

        const feedback: MessageFeedbackInput = {
            liked: selectedLiked,
            reasons: selectedReasons,
            overall: selectedLiked ? "good" : "bad",

            ...(comment.trim()
                ? {
                      comment: comment.trim(),
                  }
                : {}),
        };

        try {
            await onFeedback(
                message.id,
                feedback
            );

            setFeedbackOpen(false);
            setSelectedLiked(null);
        } catch {
            setError(
                "Could not save your feedback. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const reasons =
        selectedLiked === true
            ? positiveReasons
            : negativeReasons;

    // ============================================================
    // USER MESSAGE
    // ============================================================

    if (isUser) {
        return (
            <div className="flex w-full min-w-0 justify-end animate-message-in">
                <div className="flex min-w-0 max-w-[94%] items-end gap-2 sm:max-w-[76%] sm:gap-4">
                    <div className="min-w-0 max-w-full">
                        <div className="mb-1.5 text-right text-[10px] font-semibold tracking-[0.14em] text-white/35 sm:text-[11px]">
                            YOU
                        </div>

                        <div
                            className="
                                max-w-full
                                overflow-hidden
                                rounded-[20px]
                                rounded-br-md
                                border
                                border-white/[0.10]
                                bg-white/[0.075]
                                px-4
                                py-3
                                text-[15px]
                                leading-6
                                text-white/90
                                break-words
                                shadow-[0_12px_35px_rgba(0,0,0,0.16)]

                                sm:rounded-[22px]
                                sm:px-5
                                sm:py-3.5
                                sm:text-[17px]
                                sm:leading-7
                            "
                        >
                            {message.content}
                        </div>
                    </div>

                    <div className="mb-1 shrink-0">
                        <SoulCore />
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // ASSISTANT MESSAGE
    // ============================================================

    return (
        <>
            <div
                className="
                    flex
                    w-full
                    min-w-0
                    max-w-full
                    items-start
                    gap-2.5
                    animate-message-in

                    sm:gap-4
                "
            >
                {/* ==================================================
                    SOUL
                ================================================== */}

                <div className="mt-1 shrink-0">
                    <SoulCore />
                </div>

                {/* ==================================================
                    CONTENT
                ================================================== */}

                <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="mb-1.5 text-[10px] font-semibold tracking-[0.14em] text-cyan-200/40 sm:text-[11px]">
                        SOUL
                    </div>

                    <div
                        className="
                            min-w-0
                            max-w-full
                            overflow-hidden
                            text-[15px]
                            leading-6
                            text-white/75
                            break-words

                            sm:text-[17px]
                            sm:leading-8
                        "
                    >
                        <MessageContent
                            content={message.content}
                        />
                    </div>

                    {/* ==================================================
                        FEEDBACK BUTTONS
                    ================================================== */}

                    <div className="mt-3 flex min-h-9 items-center gap-2">
                        <button
                            type="button"
                            aria-label="Like response"
                            aria-pressed={
                                message.liked === true
                            }
                            onClick={() =>
                                openFeedback(true)
                            }
                            className={`
                                flex
                                size-9
                                items-center
                                justify-center
                                rounded-full
                                border
                                text-sm
                                transition
                                touch-manipulation

                                ${
                                    message.liked === true
                                        ? "border-white/20 bg-white/10 text-white"
                                        : "border-white/5 bg-white/[0.03] text-white/35 hover:bg-white/[0.08] hover:text-white/70"
                                }
                            `}
                        >
                            👍
                        </button>

                        <button
                            type="button"
                            aria-label="Dislike response"
                            aria-pressed={
                                message.liked === false
                            }
                            onClick={() =>
                                openFeedback(false)
                            }
                            className={`
                                flex
                                size-9
                                items-center
                                justify-center
                                rounded-full
                                border
                                text-sm
                                transition
                                touch-manipulation

                                ${
                                    message.liked === false
                                        ? "border-white/20 bg-white/10 text-white"
                                        : "border-white/5 bg-white/[0.03] text-white/35 hover:bg-white/[0.08] hover:text-white/70"
                                }
                            `}
                        >
                            👎
                        </button>
                    </div>
                </div>
            </div>

            {/* ========================================================
                FEEDBACK MODAL

                IMPORTANT:
                This is outside the message layout.
                Therefore opening it cannot change message width/height.
            ======================================================== */}

            {feedbackOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                        bg-black/75
                        p-3
                        sm:p-4
                    "
                    onClick={closeFeedback}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`feedback-title-${message.id}`}
                        className="
                            flex
                            w-full
                            max-w-md
                            min-w-0
                            flex-col
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/[0.10]
                            bg-[#101116]
                            shadow-2xl

                            max-h-[calc(100dvh-24px)]

                            sm:max-h-[calc(100dvh-32px)]
                            sm:rounded-3xl
                        "
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        {/* ==================================================
                            HEADER
                        ================================================== */}

                        <div
                            className="
                                flex
                                shrink-0
                                items-start
                                justify-between
                                gap-3
                                border-b
                                border-white/[0.06]
                                px-4
                                pb-3
                                pt-4

                                sm:px-6
                                sm:pb-4
                                sm:pt-5
                            "
                        >
                            <div className="min-w-0 flex-1">
                                <h3
                                    id={`feedback-title-${message.id}`}
                                    className="
                                        text-base
                                        font-semibold
                                        leading-6
                                        text-white
                                        sm:text-lg
                                    "
                                >
                                    {selectedLiked
                                        ? "What did you like?"
                                        : "What went wrong?"}
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        leading-5
                                        text-white/40
                                        sm:text-sm
                                    "
                                >
                                    Help us improve this
                                    response.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeFeedback}
                                disabled={submitting}
                                aria-label="Close feedback"
                                className="
                                    flex
                                    size-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-xl
                                    leading-none
                                    text-white/40
                                    transition
                                    touch-manipulation
                                    hover:bg-white/[0.06]
                                    hover:text-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                ×
                            </button>
                        </div>

                        {/* ==================================================
                            SCROLLABLE CONTENT
                        ================================================== */}

                        <div
                            className="
                                min-h-0
                                flex-1
                                overflow-x-hidden
                                overflow-y-auto
                                overscroll-contain
                                px-4
                                py-4

                                sm:px-6
                            "
                        >
                            {/* ==================================================
                                REASONS
                            ================================================== */}

                            <div className="mb-5">
                                <div
                                    className="
                                        mb-2
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.14em]
                                        text-white/40
                                        sm:text-xs
                                    "
                                >
                                    Select what applies
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {reasons.map((reason) => {
                                        const selected =
                                            selectedReasons.includes(
                                                reason.value
                                            );

                                        return (
                                            <button
                                                key={
                                                    reason.value
                                                }
                                                type="button"
                                                onClick={() =>
                                                    toggleReason(
                                                        reason.value
                                                    )
                                                }
                                                className={`
                                                    min-h-10
                                                    w-full
                                                    min-w-0
                                                    rounded-xl
                                                    border
                                                    px-2.5
                                                    py-2
                                                    text-left
                                                    text-xs
                                                    leading-4
                                                    transition
                                                    touch-manipulation

                                                    sm:min-h-11
                                                    sm:px-3
                                                    sm:text-sm
                                                    sm:leading-5

                                                    ${
                                                        selected
                                                            ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
                                                            : "border-white/[0.08] bg-white/[0.03] text-white/55 hover:bg-white/[0.07] hover:text-white"
                                                    }
                                                `}
                                            >
                                                {
                                                    reason.label
                                                }
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ==================================================
                                COMMENT
                            ================================================== */}

                            <div className="mb-4">
                                <label
                                    htmlFor={`feedback-comment-${message.id}`}
                                    className="
                                        mb-2
                                        block
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.14em]
                                        text-white/40
                                        sm:text-xs
                                    "
                                >
                                    Tell us more

                                    <span
                                        className="
                                            ml-1
                                            font-normal
                                            normal-case
                                            text-white/25
                                        "
                                    >
                                        (optional)
                                    </span>
                                </label>

                                <textarea
                                    id={`feedback-comment-${message.id}`}
                                    value={comment}
                                    onChange={(event) =>
                                        setComment(
                                            event.target.value
                                        )
                                    }
                                    maxLength={2000}
                                    rows={4}
                                    placeholder={
                                        selectedLiked
                                            ? "What made this response useful?"
                                            : "What should Soul improve?"
                                    }
                                    className="
                                        block
                                        min-h-[96px]
                                        w-full
                                        resize-none
                                        rounded-xl
                                        border
                                        border-white/[0.08]
                                        bg-white/[0.035]
                                        px-3
                                        py-2.5
                                        text-sm
                                        leading-5
                                        text-white
                                        outline-none
                                        placeholder:text-white/25
                                        focus:border-cyan-300/20
                                        sm:min-h-[110px]
                                        sm:rounded-2xl
                                        sm:px-4
                                        sm:py-3
                                    "
                                />

                                <div
                                    className="
                                        mt-1
                                        text-right
                                        text-[10px]
                                        text-white/25
                                    "
                                >
                                    {comment.length}/2000
                                </div>
                            </div>

                            {/* ==================================================
                                ERROR
                            ================================================== */}

                            {error && (
                                <div
                                    role="alert"
                                    className="
                                        rounded-xl
                                        border
                                        border-red-400/10
                                        bg-red-400/[0.05]
                                        px-3
                                        py-2
                                        text-xs
                                        leading-5
                                        text-red-200/80
                                    "
                                >
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* ==================================================
                            ACTIONS
                        ================================================== */}

                        <div
                            className="
                                shrink-0
                                border-t
                                border-white/[0.06]
                                px-4
                                py-3

                                sm:px-6
                                sm:py-4
                            "
                        >
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={closeFeedback}
                                    disabled={submitting}
                                    className="
                                        min-h-10
                                        flex-1
                                        rounded-xl
                                        px-3
                                        py-2
                                        text-sm
                                        font-medium
                                        text-white/45
                                        transition
                                        touch-manipulation
                                        hover:bg-white/[0.05]
                                        hover:text-white
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40

                                        sm:flex-none
                                        sm:px-4
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={submitFeedback}
                                    disabled={
                                        submitting ||
                                        selectedReasons.length ===
                                            0
                                    }
                                    className="
                                        min-h-10
                                        flex-1
                                        rounded-xl
                                        border
                                        border-white/[0.12]
                                        bg-white/[0.09]
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        touch-manipulation
                                        hover:bg-white/[0.14]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40

                                        sm:flex-none
                                        sm:px-5
                                    "
                                >
                                    {submitting
                                        ? "Sending..."
                                        : "Submit"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}