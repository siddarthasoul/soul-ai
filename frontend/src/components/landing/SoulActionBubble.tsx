"use client";

import SoulBubble from "@/src/components/ui/SoulBubble";

interface SoulActionBubbleProps {
    size?: "sm" | "md" | "lg";
    label?: string;
    description?: string;
    className?: string;
    onClick?: () => void;
    status?: "online" | "none";
}

const bubbleSizes = {
    sm: "size-16",
    md: "size-24",
    lg: "size-36",
};

export default function SoulActionBubble({
    size = "md",
    label,
    description,
    className = "",
    onClick,
    status = "none",
}: SoulActionBubbleProps) {
    const hasContent = Boolean(label || description);
    const isOnline = status === "online";

    return (
        <div
            className={`
                soul-action-bubble
                group
                relative
                ${bubbleSizes[size]}
                ${className}
            `}
        >
            {/* LABEL */}

            {hasContent && (
                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        bottom-full
                        z-50
                        mb-3
                        flex
                        -translate-x-1/2
                        flex-col
                        items-center
                        justify-center
                        whitespace-nowrap

                        opacity-100

                        sm:opacity-0
                        sm:transition-opacity
                        sm:duration-300
                        sm:group-hover:opacity-100
                    "
                >
                    {label && (
                        <span
                            className="
                                rounded-full
                                border
                                border-white/15
                                bg-black/80
                                px-3
                                py-1.5
                                text-xs
                                font-medium
                                tracking-wide
                                text-white
                                shadow-[0_8px_30px_rgba(0,0,0,0.35)]
                                backdrop-blur-md
                            "
                        >
                            {label}
                        </span>
                    )}

                    {description && (
                        <span
                            className="
                                mt-1
                                max-w-40
                                text-center
                                text-[11px]
                                leading-4
                                text-white/65
                            "
                        >
                            {description}
                        </span>
                    )}
                </div>
            )}

            {/* ACTION BUTTON */}

            <button
                type="button"
                onClick={onClick}
                aria-label={label ?? "SOUL action"}
                className="
                    relative
                    z-20
                    size-full
                    rounded-full
                    outline-none
                    transition-transform
                    duration-300
                    ease-out
                    hover:scale-[1.04]
                    active:scale-[0.97]
                    focus-visible:ring-2
                    focus-visible:ring-white/40
                "
            >
                <SoulBubble size={size} />

                {/* ONLINE STATUS */}

                {isOnline && (
                    <span
                        aria-label="Signed in"
                        className="
                            absolute
                            right-[6%]
                            top-[6%]
                            z-40
                            size-3
                            rounded-full
                            bg-emerald-400
                            ring-2
                            ring-black/60
                            shadow-[0_0_12px_rgba(52,211,153,0.8)]
                        "
                    />
                )}
            </button>
        </div>
    );
}