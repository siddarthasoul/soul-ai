"use client";

import {
    useCallback,
    useEffect,
    useRef,
    type KeyboardEvent,
} from "react";

import Button from "@/src/components/ui/Button";

interface ChatComposerProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void | Promise<void>;
    disabled: boolean;
    isStreaming: boolean;
    disabledReason?:
    | "connecting"
    | "joining"
    | "rate-limited";
}

export default function ChatComposer({
    value,
    onChange,
    onSend,
    disabled,
    isStreaming,
    disabledReason,
}: ChatComposerProps) {
    const textareaRef =
        useRef<HTMLTextAreaElement>(null);

    // ============================================================
    // TEXTAREA RESIZE
    // ============================================================

    const resizeTextarea = useCallback(() => {
        const textarea =
            textareaRef.current;

        if (!textarea) {
            return;
        }

        textarea.style.height = "auto";

        const nextHeight = Math.min(
            textarea.scrollHeight,
            160
        );

        textarea.style.height =
            `${nextHeight}px`;
    }, []);

    // Resize AFTER React updates the textarea value.
    useEffect(() => {
        resizeTextarea();
    }, [value, resizeTextarea]);

    // ============================================================
    // CHANGE
    // ============================================================

    const handleChange = (
        nextValue: string
    ) => {
        if (disabled) {
            return;
        }

        onChange(nextValue);
    };

    // ============================================================
    // KEYBOARD
    // ============================================================

    const handleKeyDown = (
        event: KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (event.key !== "Enter") {
            return;
        }

        // Shift + Enter = new line
        if (event.shiftKey) {
            return;
        }

        event.preventDefault();

        if (
            disabled ||
            isStreaming ||
            !value.trim()
        ) {
            return;
        }

        void onSend();
    };

    // ============================================================
    // PLACEHOLDER
    // ============================================================

    const placeholder =
        isStreaming
            ? "SOUL is thinking..."
            : disabledReason === "rate-limited"
                ? "Chat limit reached"
                : disabledReason === "joining"
                    ? "Joining conversation..."
                    : disabledReason === "connecting"
                        ? "Connecting..."
                        : "Message SOUL...";

    // ============================================================
    // UI
    // ============================================================

    return (
        <footer className="soul-chat-footer">
            <div className="soul-composer">

                <div className="soul-chat-input">

                    <div className="pointer-events-none absolute -left-16 -top-16 size-32 rounded-full bg-cyan-400/[0.06] blur-3xl" />

                    <div className="pointer-events-none absolute -bottom-20 -right-16 size-36 rounded-full bg-purple-500/[0.05] blur-3xl" />

                    <div className="soul-chat-input-inner">

                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(event) =>
                                handleChange(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            rows={1}
                            disabled={disabled}
                            placeholder={placeholder}
                            aria-disabled={disabled}
                            className="soul-textarea"
                        />

                        <Button
                            variant="glass"
                            size="md"
                            onClick={() => void onSend()}
                            disabled={
                                disabled ||
                                !value.trim()
                            }
                            aria-label="Send message"
                            className="!size-11 !min-h-11 !shrink-0 !rounded-full !px-0"
                        >
                            {isStreaming ? (
                                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="size-[17px]"
                                >
                                    <path
                                        d="M22 2 11 13"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    <path
                                        d="m22 2-7 20-4-9-9-4Z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                        </Button>

                    </div>
                </div>

                <p className="mt-2 text-center text-[10px] font-medium text-white/[0.18]">
                    SOUL can make mistakes. Verify important information.
                </p>

            </div>
        </footer>
    );
}