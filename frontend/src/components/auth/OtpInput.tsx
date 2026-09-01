
"use client";

import {
    useEffect,
    useRef,
} from "react";

interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    length?: number;
}

export default function OtpInput({
    value,
    onChange,
    disabled = false,
    length = 6,
}: OtpInputProps) {
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    const handleChange = (
        index: number,
        inputValue: string,
    ) => {
        const digit = inputValue
            .replace(/\D/g, "")
            .slice(-1);

        if (!digit) {
            return;
        }

        const digits = value.split("");

        digits[index] = digit;

        const nextValue = digits
            .join("")
            .slice(0, length);

        onChange(nextValue);

        if (index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === "Backspace") {
            if (value[index]) {
                const digits = value.split("");

                digits[index] = "";

                onChange(digits.join(""));

                return;
            }

            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }

        if (
            event.key === "ArrowLeft" &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }

        if (
            event.key === "ArrowRight" &&
            index < length - 1
        ) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (
        event: React.ClipboardEvent<HTMLInputElement>,
    ) => {
        event.preventDefault();

        const pasted = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);

        if (!pasted) return;

        onChange(pasted);

        const focusIndex = Math.min(
            pasted.length,
            length - 1,
        );

        inputRefs.current[focusIndex]?.focus();
    };

    return (
        <div
            className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                sm:gap-3
            "
        >
            {Array.from({ length }).map((_, index) => {
                const digit = value[index] ?? "";

                const filled = Boolean(digit);

                return (
                    <input
                        key={index}
                        ref={(element) => {
                            inputRefs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={
                            index === 0
                                ? "one-time-code"
                                : "off"
                        }
                        maxLength={1}
                        value={digit}
                        disabled={disabled}
                        aria-label={`Verification digit ${index + 1}`}
                        onChange={(event) =>
                            handleChange(
                                index,
                                event.target.value,
                            )
                        }
                        onKeyDown={(event) =>
                            handleKeyDown(index, event)
                        }
                        onPaste={handlePaste}
                        className={`
                            size-12
                            rounded-xl
                            border
                            text-center
                            text-lg
                            font-semibold
                            outline-none
                            transition-all
                            duration-200
                            sm:size-14

                            ${
                                filled
                                    ? `
                                        border-cyan-300/30
                                        bg-cyan-300/[0.06]
                                        text-white
                                        shadow-[0_0_20px_rgba(34,211,238,0.08)]
                                    `
                                    : `
                                        border-white/10
                                        bg-white/[0.04]
                                        text-white
                                    `
                            }

                            focus:border-cyan-300/50
                            focus:bg-white/[0.07]
                            focus:shadow-[0_0_25px_rgba(34,211,238,0.10)]

                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        `}
                    />
                );
            })}
        </div>
    );
}
