"use client";

import {
    useCallback,
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
    disabledReason?: "connecting" | "joining" | "rate-limited";
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


    const resizeTextarea = useCallback(() => {
        const textarea =
            textareaRef.current;

        if (!textarea) {
            return;
        }

        textarea.style.height = "auto";

        textarea.style.height =
            `${Math.min(
                textarea.scrollHeight,
                160
            )}px`;
    }, []);

    const handleChange = (
        nextValue: string
    ) => {
        if (disabled) {
            return;
        }

        onChange(nextValue);
        resizeTextarea();
    };

    const handleKeyDown = (
        event: KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            if (disabled) {
                return;
            }

            void onSend();
        }
    };

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

    return (
        <footer className="relative z-20 shrink-0 px-4 pb-4 pt-2 sm:px-7 sm:pb-6">
            <div className="mx-auto w-full max-w-3xl">
                <div className="relative overflow-hidden rounded-[28px] border border-white/[0.10] bg-white/[0.045] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-3xl focus-within:border-cyan-300/[0.18]">

                    <div className="pointer-events-none absolute -left-16 -top-16 size-36 rounded-full bg-cyan-400/[0.07] blur-3xl" />

                    <div className="pointer-events-none absolute -bottom-20 -right-16 size-40 rounded-full bg-purple-500/[0.06] blur-3xl" />

                    <div className="relative z-10 flex items-end gap-2">

                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(event) =>
                                handleChange(
                                    event.target.value
                                )
                            }
                            onKeyDown={
                                handleKeyDown
                            }
                            rows={1}
                            disabled={disabled}
                            placeholder={placeholder}
                            aria-disabled={disabled}
                            className="soul-textarea max-h-40 min-h-12 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-3 text-[16px] leading-7 text-white outline-none placeholder:text-white/[0.25] disabled:cursor-not-allowed disabled:opacity-50 sm:text-[17px]"
                        />

                        <Button
                            variant="glass"
                            size="md"
                            onClick={() =>
                                void onSend()
                            }
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
                    SOUL can make mistakes.
                    Verify important information.
                </p>
            </div>
        </footer>
    );


}
