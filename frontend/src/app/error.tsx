
"use client";

import { useEffect } from "react";

import SoulBackground from "@/src/components/landing/SoulBackground";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("SOUL application error:", error);
    }, [error]);

    return (
        <main className="fixed inset-0 z-[999] flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-black text-white">
            {/* SOUL background */}
            <div className="absolute inset-0 overflow-hidden">
                <SoulBackground />
            </div>

            {/* Error bubble */}
            <div
                className="
                    relative
                    z-10
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

                {/* Outer energy ring */}
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

                {/* Main glass bubble */}
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
                        shadow-[inset_0_2px_20px_rgba(255,255,255,0.08),0_0_100px_rgba(80,130,255,0.12)]
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

                    {/* Inner glass */}
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
                            px-7
                            py-8
                            text-center
                            backdrop-blur-2xl
                            shadow-[inset_0_1px_15px_rgba(255,255,255,0.06)]
                            sm:size-[78%]
                            sm:px-10
                            sm:py-10
                        "
                    >
                        {/* SOUL symbol */}
                        <div
                            aria-hidden="true"
                            className="
                                mb-5
                                flex
                                size-14
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-cyan-300/20
                                bg-white/[0.04]
                                shadow-[0_0_35px_rgba(34,211,238,0.15)]
                            "
                        >
                            <div
                                className="
                                    size-3
                                    rounded-full
                                    bg-cyan-300
                                    shadow-[0_0_20px_rgba(103,232,249,0.8)]
                                    animate-pulse
                                "
                            />
                        </div>

                        <h1 className="text-xl font-medium tracking-wide text-white sm:text-2xl">
                            Sorry, something went wrong.
                        </h1>

                        <p className="mt-3 max-w-xs text-sm leading-6 text-white/50">
                            We reached an unexpected problem while loading SOUL.
                            Please try again.
                        </p>

                        <button
                            type="button"
                            onClick={() => reset()}
                            className="
                                mt-7
                                rounded-full
                                border
                                border-white/[0.12]
                                bg-white/[0.06]
                                px-6
                                py-2.5
                                text-sm
                                text-white/80
                                backdrop-blur-xl
                                transition
                                duration-200
                                hover:bg-white/[0.10]
                                hover:text-white
                                active:scale-95
                            "
                        >
                            Try again
                        </button>
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
        </main>
    );
}
