"use client";

interface LogoProps {
    size?: "sm" | "md" | "lg";
    showText?: boolean;
    animated?: boolean;
}

const sizes = {
    sm: {
        container: "size-8",
        core: "size-2",
        text: "text-lg",
    },

    md: {
        container: "size-11",
        core: "size-3",
        text: "text-xl",
    },

    lg: {
        container: "size-16",
        core: "size-4",
        text: "text-3xl",
    },
};

export default function Logo({
    size = "md",
    showText = true,
    animated = true,
}: LogoProps) {
    const s = sizes[size];

    return (
        <div className="flex items-center gap-3">
            {/* Logo symbol */}
            <div
                className={`
                    relative
                    ${s.container}

                    flex
                    items-center
                    justify-center

                    shrink-0

                    rounded-full

                    ${animated
                        ? "soul-logo-breathe"
                        : ""}
                `}
            >
                {/* Outer glow */}
                <div
                    aria-hidden="true"
                    className="
                        absolute
                        inset-[-25%]

                        rounded-full

                        bg-[radial-gradient(circle,rgba(120,180,255,0.28),transparent_65%)]

                        blur-xl
                    "
                />

                {/* Violet glow */}
                <div
                    aria-hidden="true"
                    className="
                        absolute
                        inset-0

                        rounded-full

                        bg-[radial-gradient(circle,rgba(168,85,247,0.22),transparent_65%)]

                        blur-md
                    "
                />

                {/* Glass body */}
                <div
                    className="
                        absolute
                        inset-0

                        rounded-full

                        border
                        border-white/20

                        bg-white/[0.045]

                        backdrop-blur-xl

                        shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]
                    "
                />

                {/* Orbit 1 */}
                <span
                    aria-hidden="true"
                    className="
                        absolute
                        inset-[15%]

                        rounded-full

                        border
                        border-white/30

                        rotate-[35deg]
                        scale-x-[0.55]

                        opacity-80
                    "
                />

                {/* Orbit 2 */}
                <span
                    aria-hidden="true"
                    className="
                        absolute
                        inset-[15%]

                        rounded-full

                        border
                        border-cyan-300/30

                        rotate-[-35deg]
                        scale-x-[0.55]

                        opacity-70
                    "
                />

                {/* Core */}
                <span
                    aria-hidden="true"
                    className={`
                        relative
                        z-10

                        ${s.core}

                        rounded-full

                        bg-white

                        shadow-[0_0_18px_rgba(255,255,255,0.9)]
                    `}
                />

                {/* Tiny light */}
                <span
                    aria-hidden="true"
                    className="
                        absolute
                        right-[22%]
                        top-[22%]

                        size-1

                        rounded-full

                        bg-cyan-200

                        shadow-[0_0_10px_rgba(103,232,249,0.9)]
                    "
                />
            </div>

            {/* Wordmark */}
            {showText && (
                <span
                    className={`
                        ${s.text}

                        font-semibold
                        tracking-[-0.06em]

                        text-white
                    `}
                >
                    SOUL
                </span>
            )}
        </div>
    );
}