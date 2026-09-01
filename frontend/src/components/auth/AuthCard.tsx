"use client";

import type { ReactNode } from "react";

interface AuthCardProps {
    children: ReactNode;
}

export default function AuthCard({
    children,
}: AuthCardProps) {
    return (
        <div
            className="
                relative
                flex
                size-[min(92vw,520px)]
                items-center
                justify-center
            "
        >
            {/* Outer atmosphere */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -inset-16
                    rounded-full
                    bg-[radial-gradient(
                        circle,
                        rgba(34,211,238,0.18),
                        rgba(139,92,246,0.13),
                        rgba(236,72,153,0.06),
                        transparent 70%
                    )]
                    blur-3xl
                "
            />

            {/* Main rotating ring */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -inset-5
                    rounded-full
                    border
                    border-white/[0.08]
                    border-t-cyan-300/70
                    border-r-purple-400/40
                    animate-[spin_10s_linear_infinite]
                "
            />

            {/* Reverse rotating ring */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -inset-2
                    rounded-full
                    border
                    border-white/[0.06]
                    border-b-pink-400/40
                    border-l-cyan-300/30
                    animate-[spin_16s_linear_infinite_reverse]
                "
            />

            {/* Main SOUL glass circle */}
            <div
                className="
                    relative
                    flex
                    size-full
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    border
                    border-white/[0.14]
                    bg-white/[0.035]
                    backdrop-blur-3xl
                    shadow-[inset_0_2px_20px_rgba(255,255,255,0.08)]
                    shadow-[0_0_100px_rgba(80,130,255,0.14)]
                "
            >
                {/* Cyan energy */}
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        -left-[18%]
                        -top-[12%]
                        size-[62%]
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
                        pointer-events-none
                        absolute
                        -bottom-[18%]
                        -right-[12%]
                        size-[65%]
                        rounded-full
                        bg-purple-500/15
                        blur-3xl
                    "
                />

                {/* Pink energy */}
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        bottom-[10%]
                        left-[18%]
                        size-[35%]
                        rounded-full
                        bg-pink-400/10
                        blur-3xl
                    "
                />

                {/* Inner glass */}
                <div
                    className="
                        relative
                        z-10
                        flex
                        size-[78%]
                        flex-col
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/[0.10]
                        bg-black/20
                        px-8
                        py-10
                        backdrop-blur-2xl
                        shadow-[inset_0_1px_15px_rgba(255,255,255,0.06)]
                    "
                >
                    {children}
                </div>

                {/* Glass reflection */}
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        left-[13%]
                        top-[8%]
                        h-[24%]
                        w-[43%]
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