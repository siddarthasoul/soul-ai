
"use client";

interface SoulBubbleProps {
    size?: "sm" | "md" | "lg";
}

const sizes = {
    sm: "size-16",
    md: "size-28",
    lg: "size-44",
};

export default function SoulBubble({
    size = "md",
}: SoulBubbleProps) {
    return (
        <div
            className={`
                soul-bubble
                ${sizes[size]}
                relative
                shrink-0
            `}
        >
            {/* Outer atmospheric glow */}
            <div
                aria-hidden="true"
                className="
                    absolute
                    -inset-12
                    rounded-full
                    bg-[radial-gradient(
                        circle,
                        rgba(34,211,238,0.20),
                        rgba(139,92,246,0.16),
                        rgba(236,72,153,0.08),
                        transparent 70%
                    )]
                    blur-3xl
                    soul-bubble-aura
                "
            />

            {/* Rotating energy ring */}
            <div
                aria-hidden="true"
                className="
                    absolute
                    -inset-2
                    rounded-full
                    border
                    border-cyan-300/10
                    border-t-cyan-300/50
                    border-r-purple-400/30
                    soul-bubble-ring
                "
            />

            {/* Main glass sphere */}
            <div
                className="
                    absolute
                    inset-0
                    overflow-hidden
                    rounded-full

                    border
                    border-white/20

                    bg-white/[0.045]

                    backdrop-blur-2xl

                    shadow-[inset_0_2px_10px_rgba(255,255,255,0.18)]
                    shadow-[0_0_70px_rgba(80,130,255,0.12)]

                    soul-bubble-body
                "
            >
                {/* Cyan liquid */}
                <div
                    aria-hidden="true"
                    className="
                        absolute
                        -left-[25%]
                        -top-[15%]
                        size-[75%]
                        rounded-full
                        bg-cyan-400/25
                        blur-2xl
                        soul-bubble-liquid
                    "
                />

                {/* Purple liquid */}
                <div
                    aria-hidden="true"
                    className="
                        absolute
                        -bottom-[20%]
                        -right-[20%]
                        size-[85%]
                        rounded-full
                        bg-purple-500/25
                        blur-2xl
                        soul-bubble-liquid-reverse
                    "
                />

                {/* Pink liquid */}
                <div
                    aria-hidden="true"
                    className="
                        absolute
                        bottom-[5%]
                        left-[20%]
                        size-[40%]
                        rounded-full
                        bg-pink-400/20
                        blur-2xl
                        soul-bubble-pink
                    "
                />

                {/* Liquid distortion layer */}
                <div
                    aria-hidden="true"
                    className="
                        absolute
                        inset-0
                        rounded-full
                        bg-[radial-gradient(
                            circle_at_35%_25%,
                            rgba(255,255,255,0.14),
                            transparent 28%
                        )]
                        opacity-80
                    "
                />

                {/* SOUL energy core */}
                <div
                    className="
                        absolute
                        left-1/2
                        top-1/2

                        flex
                        size-[42%]
                        -translate-x-1/2
                        -translate-y-1/2

                        items-center
                        justify-center

                        rounded-[42%]

                        border
                        border-white/20

                        bg-white/[0.08]

                        backdrop-blur-xl

                        shadow-[0_0_40px_rgba(255,255,255,0.15)]

                        soul-core
                    "
                >
                    {/* Core light */}
                    <div
                        className="
                            size-[25%]
                            rounded-full
                            bg-white
                            shadow-[0_0_12px_rgba(255,255,255,0.9)]
                            shadow-[0_0_35px_rgba(103,232,249,0.65)]
                            soul-core-light
                        "
                    />
                </div>

                {/* Top glass reflection */}
                <div
                    aria-hidden="true"
                    className="
                        absolute
                        left-[12%]
                        top-[8%]

                        h-[25%]
                        w-[48%]

                        rotate-[-25deg]

                        rounded-full

                        bg-white/20

                        blur-md
                    "
                />

                {/* Moving glass reflection */}
                <div
                    aria-hidden="true"
                    className="
                        absolute
                        -left-full
                        top-0

                        h-full
                        w-1/2

                        rotate-[20deg]

                        bg-gradient-to-r
                        from-transparent
                        via-white/15
                        to-transparent

                        soul-bubble-shine
                    "
                />
            </div>
        </div>
    );
}
