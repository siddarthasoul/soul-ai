"use client";

interface SoulCoreProps {
    size?: "sm" | "md";
}

const sizes = {
    sm: "size-9",
    md: "size-12",
};

export default function SoulCore({
    size = "sm",
}: SoulCoreProps) {
    return (
        <div
            className={`
                relative
                shrink-0
                ${sizes[size]}
            `}
        >
            {/* Aura */}

            <div
                aria-hidden="true"
                className="
                    absolute
                    -inset-3
                    rounded-full
                    bg-[radial-gradient(
                        circle,
                        rgba(34,211,238,0.20),
                        rgba(139,92,246,0.14),
                        transparent 70%
                    )]
                    blur-xl
                    animate-[soulCoreAura_5s_ease-in-out_infinite]
                "
            />

            {/* Glass sphere */}

            <div
                className="
                    absolute
                    inset-0
                    overflow-hidden
                    rounded-full
                    border
                    border-white/[0.16]
                    bg-white/[0.025]
                    backdrop-blur-md
                    shadow-[inset_0_1px_5px_rgba(255,255,255,0.18)]
                    shadow-[0_0_28px_rgba(80,130,255,0.12)]
                "
            >
                {/* Cyan liquid */}

                <div
                    aria-hidden="true"
                    className="
                        absolute
                        -left-2
                        -top-2
                        size-6
                        rounded-full
                        bg-cyan-400/[0.18]
                        blur-md
                        animate-[soulLiquidOne_5s_ease-in-out_infinite]
                    "
                />

                {/* Purple liquid */}

                <div
                    aria-hidden="true"
                    className="
                        absolute
                        -bottom-2
                        -right-2
                        size-7
                        rounded-full
                        bg-purple-500/[0.18]
                        blur-md
                        animate-[soulLiquidTwo_7s_ease-in-out_infinite]
                    "
                />

                {/* Inner core */}

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
                        rounded-[40%]
                        border
                        border-white/[0.18]
                        bg-white/[0.045]
                        backdrop-blur-sm
                        animate-[soulCore_4s_ease-in-out_infinite]
                    "
                >
                    <div
                        className="
                            size-[28%]
                            rounded-full
                            bg-white
                            shadow-[0_0_8px_rgba(255,255,255,0.95)]
                            shadow-[0_0_18px_rgba(103,232,249,0.75)]
                            animate-[soulCoreLight_2.5s_ease-in-out_infinite]
                        "
                    />
                </div>

                {/* Reflection */}

                <div
                    aria-hidden="true"
                    className="
                        absolute
                        left-[14%]
                        top-[10%]
                        h-[25%]
                        w-[45%]
                        rotate-[-25deg]
                        rounded-full
                        bg-white/[0.16]
                        blur-[3px]
                    "
                />
            </div>
        </div>
    );
}