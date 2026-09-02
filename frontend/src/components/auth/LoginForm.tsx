"use client";

import {
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import useAuth from "@/src/hooks/useAuth";

import Button from "@/src/components/ui/Button";

export default function LoginForm() {
    const router = useRouter();

    const { requestOtp, isLoading } = useAuth();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError("");

        const normalizedEmail =
            email.trim().toLowerCase();

        if (!normalizedEmail) {
            setError("Email is required.");
            return;
        }

        try {
            const response = await requestOtp({
                email: normalizedEmail,
            });

            if (!response.success) {
                setError(
                    response.message ??
                        "Unable to send verification code.",
                );
                return;
            }

            router.push(
                `/login/verify?email=${encodeURIComponent(
                    normalizedEmail,
                )}`,
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong.",
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="
                flex
                w-full
                min-w-0
                flex-col
                gap-2
                sm:gap-4
            "
        >
            {/* Email */}
            <div
                className="
                    flex
                    min-w-0
                    flex-col
                    gap-0.5
                    sm:gap-1.5
                "
            >
                <label
                    htmlFor="email"
                    className="
                        text-[9px]
                        font-medium
                        text-white/60
                        sm:text-xs
                    "
                >
                    Email
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    disabled={isLoading}
                    className="
                        box-border
                        h-7
                        w-full
                        min-w-0
                        max-w-full
                        rounded-lg
                        border
                        border-white/10
                        bg-white/[0.035]
                        px-2.5
                        text-[11px]
                        text-white
                        outline-none
                        placeholder:text-white/25
                        backdrop-blur-xl
                        transition-all
                        duration-300
                        focus:border-cyan-300/30
                        focus:bg-white/[0.055]
                        focus:ring-1
                        focus:ring-cyan-300/10
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                        sm:h-10
                        sm:rounded-xl
                        sm:px-3.5
                        sm:text-sm
                    "
                />
            </div>

            {/* Error */}
            {error && (
                <p
                    role="alert"
                    className="
                        w-full
                        min-w-0
                        max-w-full
                        break-words
                        rounded-md
                        border
                        border-red-400/10
                        bg-red-400/[0.04]
                        px-2
                        py-0.5
                        text-[9px]
                        leading-3.5
                        text-red-300/90
                        sm:rounded-lg
                        sm:px-3
                        sm:py-1.5
                        sm:text-xs
                        sm:leading-5
                    "
                >
                    {error}
                </p>
            )}

            {/* Continue */}
            <div
                className="
                    flex
                    justify-center
                    pt-0
                    sm:pt-1
                "
            >
                <Button
                    type="submit"
                    variant="glass"
                    size="sm"
                    loading={isLoading}
                    className="
                        scale-90
                        sm:scale-100
                    "
                >
                    Continue
                </Button>
            </div>

            {/* Register */}
            <div
                className="
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-1
                    px-1
                    text-[9px]
                    leading-4
                    sm:gap-1.5
                    sm:text-xs
                "
            >
                <span className="text-center text-white/35">
                    Don't have a SOUL account?
                </span>

                <button
                    type="button"
                    onClick={() =>
                        router.push("/register")
                    }
                    disabled={isLoading}
                    className="
                        shrink-0
                        text-cyan-300/80
                        transition-colors
                        hover:text-cyan-200
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                >
                    Create one
                </button>
            </div>
        </form>
    );
}
