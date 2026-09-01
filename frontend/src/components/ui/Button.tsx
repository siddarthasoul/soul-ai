
"use client";

import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "ghost"
    | "glass";

type ButtonSize =
    | "sm"
    | "md"
    | "lg";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    breathing?: boolean;
}

const variantStyles: Record<
    ButtonVariant,
    string
> = {
    primary: `
        bg-white
        text-black
        border
        border-white/80
        shadow-[0_8px_30px_rgba(255,255,255,0.12)]
        hover:bg-white/90
        hover:shadow-[0_12px_40px_rgba(255,255,255,0.20)]
    `,

    secondary: `
        bg-white/[0.06]
        text-white
        border
        border-white/10
        backdrop-blur-xl
        hover:bg-white/[0.10]
        hover:border-white/20
    `,

    ghost: `
        bg-transparent
        text-white/60
        border
        border-transparent
        hover:bg-white/[0.06]
        hover:text-white
    `,

    glass: `
        soul-glass-button
        text-white
    `,
};

const sizeStyles: Record<
    ButtonSize,
    string
> = {
    sm: `
        min-h-9
        rounded-xl
        px-4
        text-sm
    `,

    md: `
        min-h-11
        rounded-xl
        px-5
        text-sm
    `,

    lg: `
        min-h-13
        rounded-2xl
        px-7
        text-base
    `,
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    breathing = false,
    disabled,
    className = "",
    type = "button",
    ...props
}: ButtonProps) {

    const isDisabled =
        disabled || loading;

    return (
        <button
            {...props}
            type={type}
            disabled={isDisabled}
            className={`
                group
                relative
                inline-flex
                min-w-0
                max-w-full
                items-center
                justify-center
                gap-2
                overflow-hidden
                font-medium
                tracking-[-0.01em]
                transition-all
                duration-300
                ease-out
                active:scale-[0.97]
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-white/40
                focus-visible:ring-offset-2
                focus-visible:ring-offset-black
                disabled:pointer-events-none
                disabled:opacity-50

                ${variantStyles[variant]}

                ${sizeStyles[size]}

                ${
                    breathing && !isDisabled
                        ? "animate-soul-button"
                        : ""
                }

                ${className}
            `}
        >
            {/* Moving reflection */}
            <span
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    -translate-x-[140%]
                    skew-x-[-20deg]
                    bg-gradient-to-r
                    from-transparent
                    via-white/[0.12]
                    to-transparent
                    transition-transform
                    duration-1000
                    group-hover:translate-x-[140%]
                "
            />

            {/* Inner glow */}
            <span
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-px
                    rounded-[inherit]
                    bg-gradient-to-b
                    from-white/[0.08]
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                "
            />

            {loading ? (
                <>
                    <span
                        className="
                            relative
                            z-10
                            size-4
                            shrink-0
                            animate-spin
                            rounded-full
                            border-2
                            border-current
                            border-t-transparent
                        "
                    />

                    <span className="relative z-10 truncate">
                        Loading...
                    </span>
                </>
            ) : (
                <span className="relative z-10 truncate">
                    {children}
                </span>
            )}
        </button>
    );
}