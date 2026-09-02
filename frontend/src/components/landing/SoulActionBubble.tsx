
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
    sm: "size-[clamp(3.5rem,14vw,4.5rem)]",
    md: "size-[clamp(4.5rem,18vw,6rem)]",
    lg: "size-[clamp(5.5rem,22vw,8rem)]",
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
                min-w-0
                shrink
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
                        bottom-full
                        left-1/2
                        z-50
                        mb-2
                        flex
                        max-w-[calc(100vw-2rem)]
                        -translate-x-1/2
                        flex-col
                        items-center
                        justify-center
                        text-center
                        opacity-100
                        sm:mb-3
                        sm:opacity-0
                        sm:transition-opacity
                        sm:duration-300
                        sm:group-hover:opacity-100
                    "
                >
                    {label && (
                        <span
                            className="
                                max-w-[calc(100vw-2rem)]
                                truncate
                                rounded-full
                                border
                                border-white/15
                                bg-black/85
                                px-2.5
                                py-1
                                text-[10px]
                                font-medium
                                tracking-wide
                                text-white
                                shadow-[0_8px_30px_rgba(0,0,0,0.35)]
                                backdrop-blur-md
                                sm:px-3
                                sm:py-1.5
                                sm:text-xs
                            "
                        >
                            {label}
                        </span>
                    )}

                    {description && (
                        <span
                            className="
                                mt-1
                                w-max
                                max-w-[min(11rem,calc(100vw-2rem))]
                                text-center
                                text-[9px]
                                leading-3.5
                                text-white/60
                                sm:text-[11px]
                                sm:leading-4
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
                    block
                    size-full
                    rounded-full
                    outline-none
                    transition-transform
                    duration-300
                    ease-out
                    hover:scale-[1.04]
                    active:scale-[0.96]
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
                            right-[5%]
                            top-[5%]
                            z-40
                            size-[clamp(0.5rem,2vw,0.75rem)]
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
