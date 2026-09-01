"use client";

import type { ReactNode } from "react";

interface AuthBubbleProps {
    children: ReactNode;
}

export default function AuthBubble({
    children,
}: AuthBubbleProps) {
    return (
        <div
            className="
relative
flex
size-[min(92vw,520px)]
max-h-[90svh]
max-w-[90svh]
items-center
justify-center


            sm:size-[min(92vw,520px)]
            sm:max-h-none
            sm:max-w-none
        "
        >
            {/* Outer atmospheric glow */}
            <div
                aria-hidden="true"
                className="
                absolute
                -inset-10
                rounded-full
                bg-[radial-gradient(
                    circle,
                    rgba(34,211,238,0.16),
                    rgba(139,92,246,0.12),
                    rgba(236,72,153,0.06),
                    transparent 70%
                )]
                blur-3xl

                sm:-inset-16
            "
            />

            {/* Rotating outer energy ring */}
            <div
                aria-hidden="true"
                className="
                absolute
                -inset-3
                rounded-full
                border
                border-white/[0.08]
                border-t-cyan-300/70
                border-r-purple-400/40
                animate-[spin_10s_linear_infinite]

                sm:-inset-5
            "
            />

            {/* Second energy ring */}
            <div
                aria-hidden="true"
                className="
                absolute
                -inset-1.5
                rounded-full
                border
                border-white/[0.06]
                border-b-pink-400/30
                border-l-cyan-300/30
                animate-[spin_16s_linear_infinite_reverse]

                sm:-inset-2
            "
            />

            {/* Main circular glass body */}
            <div
                className="
                relative
                flex
                size-full
                min-h-0
                min-w-0
                items-center
                justify-center
                overflow-hidden
                rounded-full
                border
                border-white/[0.14]
                bg-white/[0.035]
                backdrop-blur-3xl
                shadow-[inset_0_2px_20px_rgba(255,255,255,0.08)]
                shadow-[0_0_100px_rgba(80,130,255,0.12)]
            "
            >
                {/* Cyan energy */}
                <div
                    aria-hidden="true"
                    className="
                    absolute
                    -left-[15%]
                    -top-[10%]
                    size-[60%]
                    rounded-full
                    bg-cyan-400/15
                    blur-3xl
                    animate-pulse
                "
                />

                {/* Purple energy */}
                <div
                    aria-hidden="true"
                    className="
                    absolute
                    -bottom-[15%]
                    -right-[10%]
                    size-[65%]
                    rounded-full
                    bg-purple-500/15
                    blur-3xl
                "
                />

                {/* Inner content */}
                <div
                    className="
                    relative
                    z-10
                    flex
                    size-[88%]
                    min-h-0
                    min-w-0
                    flex-col
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/[0.10]
                    bg-black/20
                    px-5
                    py-4
                    backdrop-blur-2xl
                    shadow-[inset_0_1px_15px_rgba(255,255,255,0.06)]

                    sm:size-[78%]
                    sm:px-10
                    sm:py-6
                "
                >
                    <div
                        className="
                        flex
                        w-full
                        min-w-0
                        min-h-0
                        items-center
                        justify-center
                    "
                    >
                        {children}
                    </div>
                </div>

                {/* Glass reflection */}
                <div
                    aria-hidden="true"
                    className="
                    pointer-events-none
                    absolute
                    left-[14%]
                    top-[9%]
                    h-[24%]
                    w-[42%]
                    rotate-[-25deg]
                    rounded-full
                    bg-white/[0.10]
                    blur-md
                "
                />

                {/* Moving shine */}
                <div
                    aria-hidden="true"
                    className="
                    pointer-events-none
                    absolute
                    -left-full
                    top-0
                    h-full
                    w-1/3
                    rotate-[20deg]
                    bg-gradient-to-r
                    from-transparent
                    via-white/[0.08]
                    to-transparent
                    animate-[soul-shine_6s_ease-in-out_infinite]
                "
                />
            </div>
        </div>
    );


}
