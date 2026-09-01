"use client";

import {
FormEvent,
useState,
} from "react";

import { useRouter } from "next/navigation";

import useUser from "@/src/hooks/useUser";

import Button from "@/src/components/ui/Button";

export default function RegisterForm() {
const router = useRouter();


const { createUser } = useUser();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [dob, setDob] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
        setError("Name is required.");
        return;
    }

    if (!email.trim()) {
        setError("Email is required.");
        return;
    }

    if (!dob) {
        setError("Date of birth is required.");
        return;
    }

    try {
        setLoading(true);

        const normalizedEmail =
            email.trim().toLowerCase();

        const response = await createUser({
            name: name.trim(),
            email: normalizedEmail,
            dob,
        });

        if (!response.success) {
            setError(
                response.message ??
                    "Unable to create account.",
            );

            return;
        }

        router.push(
            `/verify?email=${encodeURIComponent(
                normalizedEmail,
            )}`,
        );
    } catch (error) {
        setError(
            error instanceof Error
                ? error.message
                : "Something went wrong.",
        );
    } finally {
        setLoading(false);
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

            sm:gap-3.5
        "
    >
        {/* Name */}
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
                htmlFor="name"
                className="
                    text-[10px]
                    font-medium
                    text-white/60

                    sm:text-xs
                "
            >
                Name
            </label>

            <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) =>
                    setName(event.target.value)
                }
                placeholder="Your name"
                disabled={loading}
                className="
                    box-border
                    h-8
                    w-full
                    min-w-0
                    max-w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.035]
                    px-3
                    text-xs
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
                    sm:px-3.5
                    sm:text-sm
                "
            />
        </div>

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
                    text-[10px]
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
                value={email}
                onChange={(event) =>
                    setEmail(event.target.value)
                }
                placeholder="you@example.com"
                disabled={loading}
                className="
                    box-border
                    h-8
                    w-full
                    min-w-0
                    max-w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.035]
                    px-3
                    text-xs
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
                    sm:px-3.5
                    sm:text-sm
                "
            />
        </div>

        {/* Date of birth */}
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
                htmlFor="dob"
                className="
                    text-[10px]
                    font-medium
                    text-white/60

                    sm:text-xs
                "
            >
                Date of birth
            </label>

            <input
                id="dob"
                name="dob"
                type="date"
                value={dob}
                onChange={(event) =>
                    setDob(event.target.value)
                }
                disabled={loading}
                className="
                    box-border
                    h-8
                    w-full
                    min-w-0
                    max-w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.035]
                    px-3
                    text-xs
                    text-white
                    outline-none
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
                    rounded-lg
                    border
                    border-red-400/10
                    bg-red-400/[0.04]
                    px-2.5
                    py-1
                    text-[10px]
                    leading-4
                    text-red-300/90

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
                w-full
                min-w-0
                justify-center
                pt-0.5

                sm:pt-1
            "
        >
            <Button
                type="submit"
                variant="glass"
                size="md"
                loading={loading}
                className="
                    max-w-full
                    shrink
                "
            >
                Continue
            </Button>
        </div>
    </form>
);
        }