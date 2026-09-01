
"use client";

import {
    useEffect,
    useState,
} from "react";

import { useRouter } from "next/navigation";
import axios from "axios";

import FeedbackCategory from "./FeedbackCategory";
import FeedbackRating from "./FeedbackRating";
import FeedbackProblems from "./FeedbackProblems";

import type {
    CreateFeedbackInput,
    FeedbackProblem,
    FeedbackType,
} from "@/src/types/feedback.types";

interface FeedbackFormProps {
    onSubmit: (
        data: CreateFeedbackInput
    ) => Promise<{
        feedbackId: string;
        overall: number;
        message: string;
    } | null>;

    isSubmitting: boolean;

    rateLimited: boolean;

    retryAfter: number;
}

export default function FeedbackForm({
    onSubmit,
    isSubmitting,
    rateLimited,
    retryAfter,
}: FeedbackFormProps) {
    const router = useRouter();

    const [type, setType] =
        useState<FeedbackType>("general");

    const [ratings, setRatings] =
        useState<CreateFeedbackInput["ratings"]>(
            {}
        );

    const [problems, setProblems] =
        useState<FeedbackProblem[]>([]);

    const [comment, setComment] =
        useState("");

    const [featureSuggestion, setFeatureSuggestion] =
        useState("");

    const [error, setError] =
        useState<string | null>(null);

    const [success, setSuccess] = useState<{
        feedbackId: string;
        overall: number;
        message: string;
    } | null>(null);

    /*
     * ============================================================
     * RATE LIMIT COUNTDOWN
     * ============================================================
     */

    const [remainingSeconds, setRemainingSeconds] =
        useState(Math.max(retryAfter, 0));

    useEffect(() => {
        setRemainingSeconds(
            Math.max(retryAfter, 0)
        );
    }, [retryAfter]);

    useEffect(() => {
        if (
            !rateLimited ||
            remainingSeconds <= 0
        ) {
            return;
        }

        const timer =
            window.setInterval(() => {
                setRemainingSeconds(
                    (current) =>
                        Math.max(
                            current - 1,
                            0
                        )
                );
            }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, [
        rateLimited,
        remainingSeconds,
    ]);

    const formatRetryTime = (
        seconds: number
    ): string => {
        const safeSeconds = Math.max(
            Math.floor(seconds),
            0
        );

        const days = Math.floor(
            safeSeconds / 86400
        );

        const hours = Math.floor(
            (safeSeconds % 86400) / 3600
        );

        const minutes = Math.floor(
            (safeSeconds % 3600) / 60
        );

        const secs = safeSeconds % 60;

        if (days > 0) {
            return `${days}d ${hours}h`;
        }

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }

        if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        }

        return `${secs}s`;
    };

    /*
     * ============================================================
     * UPDATE RATING
     * ============================================================
     */

    const updateRating = (
        key: keyof CreateFeedbackInput["ratings"],
        value: number
    ) => {
        setRatings((current) => ({
            ...current,
            [key]: value,
        }));
    };

    /*
     * ============================================================
     * TOGGLE PROBLEM
     * ============================================================
     */

    const toggleProblem = (
        problem: FeedbackProblem
    ) => {
        setProblems((current) =>
            current.includes(problem)
                ? current.filter(
                    (item) =>
                        item !== problem
                )
                : [...current, problem]
        );
    };

    /*
     * ============================================================
     * SUBMIT
     * ============================================================
     */

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            isSubmitting ||
            rateLimited ||
            remainingSeconds > 0
        ) {
            return;
        }

        setError(null);

        if (
            Object.keys(ratings).length === 0
        ) {
            setError(
                "Please give at least one rating."
            );

            return;
        }

        try {
            const metadata:
                CreateFeedbackInput["metadata"] =
                typeof window !==
                "undefined"
                    ? {
                        browser:
                            typeof navigator !==
                            "undefined"
                                ? navigator.userAgent.slice(
                                    0,
                                    100
                                )
                                : undefined,

                        os: undefined,

                        device:
                            window.innerWidth <
                            768
                                ? "mobile"
                                : window.innerWidth <
                                    1024
                                    ? "tablet"
                                    : "desktop",

                        screenWidth:
                            window.innerWidth,

                        screenHeight:
                            window.innerHeight,

                        appVersion:
                            undefined,

                        page:
                            window.location.pathname.slice(
                                0,
                                500
                            ),
                    }
                    : undefined;

            const payload: CreateFeedbackInput = {
                type,

                ratings,

                problems:
                    problems.length > 0
                        ? problems
                        : undefined,

                comment:
                    comment.trim().length > 0
                        ? comment.trim()
                        : undefined,

                featureSuggestion:
                    type === "feature" &&
                    featureSuggestion
                        .trim()
                        .length > 0
                        ? featureSuggestion.trim()
                        : undefined,

                metadata,
            };

            const result =
                await onSubmit(payload);

            setSuccess(result);

            setRatings({});
            setProblems([]);
            setComment("");
            setFeatureSuggestion("");
            setType("general");
        } catch (error) {
            console.error(
                "[FeedbackForm] SUBMIT FAILED:",
                error
            );

            /*
             * 429 is already handled by useFeedback.
             *
             * Do not overwrite its rate-limit message.
             */
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 429
            ) {
                return;
            }

            if (axios.isAxiosError(error)) {
                const backendMessage =
                    error.response?.data?.message ||
                    error.response?.data?.error;

                if (
                    typeof backendMessage ===
                    "string"
                ) {
                    setError(
                        backendMessage
                    );
                } else {
                    setError(
                        "Failed to submit feedback. Please try again."
                    );
                }

                return;
            }

            if (error instanceof Error) {
                setError(error.message);
                return;
            }

            setError(
                "Failed to submit feedback. Please try again."
            );
        }
    };

    /*
     * ============================================================
     * SUCCESS
     * ============================================================
     */

    if (success) {
        return (
            <div
                className="
                    fixed inset-0 z-50
                    flex items-center justify-center
                    bg-black/70 px-4
                    backdrop-blur-md
                "
            >
                <div
                    className="
                        relative w-full max-w-md
                        overflow-hidden
                        rounded-[2rem]
                        border border-white/[0.10]
                        bg-[#090909]
                        p-7 shadow-2xl
                        sm:p-9
                    "
                >
                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute -left-24 -top-24
                            size-48 rounded-full
                            bg-cyan-400/10 blur-3xl
                        "
                    />

                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute -bottom-24 -right-24
                            size-48 rounded-full
                            bg-purple-500/10 blur-3xl
                        "
                    />

                    <div className="relative text-center">
                        <div
                            className="
                                mx-auto flex size-16
                                items-center justify-center
                                rounded-full
                                border border-cyan-300/20
                                bg-cyan-300/[0.06]
                                text-2xl text-cyan-200
                            "
                        >
                            ✓
                        </div>

                        <h2
                            className="
                                mt-5 text-2xl
                                font-semibold
                                tracking-tight
                                text-white
                            "
                        >
                            Thank you for your feedback
                        </h2>

                        <p
                            className="
                                mx-auto mt-3 max-w-sm
                                text-sm leading-6
                                text-white/45
                            "
                        >
                            {success.message}
                        </p>

                        <div
                            className="
                                mx-auto mt-7
                                rounded-2xl
                                border border-white/[0.08]
                                bg-white/[0.025]
                                px-5 py-4
                            "
                        >
                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.22em]
                                    text-white/30
                                "
                            >
                                Your overall rating
                            </p>

                            <div
                                className="
                                    mt-2 flex
                                    items-center
                                    justify-center
                                    gap-2
                                "
                            >
                                <span
                                    className="
                                        text-4xl
                                        font-semibold
                                        text-white
                                    "
                                >
                                    {success.overall}
                                </span>

                                <span className="text-sm text-white/30">
                                    / 5
                                </span>
                            </div>

                            <div
                                className="
                                    mt-2 text-sm
                                    tracking-[0.2em]
                                    text-cyan-200/70
                                "
                            >
                                {"★".repeat(
                                    Math.round(
                                        success.overall
                                    )
                                )}
                            </div>
                        </div>

                        <div className="mt-7">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/")
                                }
                                className="
                                    h-12 w-full
                                    rounded-2xl
                                    border border-white/[0.08]
                                    bg-white/[0.025]
                                    text-sm font-medium
                                    text-white/70
                                    transition
                                    hover:bg-white/[0.05]
                                    hover:text-white
                                "
                            >
                                Go to Home
                            </button>
                        </div>

                        <p
                            className="
                                mt-5 text-[11px]
                                text-white/20
                            "
                        >
                            We’ll use your feedback
                            to make SOUL better.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    /*
     * ============================================================
     * RATE LIMIT STATE
     * ============================================================
     */

    const isRateLimited =
        rateLimited &&
        remainingSeconds > 0;

    const submitDisabled =
        isSubmitting ||
        isRateLimited;

    /*
     * ============================================================
     * FORM
     * ============================================================
     */

    return (
        <form
            onSubmit={handleSubmit}
            className="
                mx-auto w-full max-w-2xl
                space-y-5
            "
        >
            {/*
             * ======================================================
             * RATE LIMIT POPUP / CARD
             * ======================================================
             */}

            {isRateLimited && (
                <div
                    role="alert"
                    className="
                        relative overflow-hidden
                        rounded-3xl
                        border border-amber-300/10
                        bg-amber-300/[0.035]
                        px-5 py-6
                        text-center
                    "
                >
                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute left-1/2 top-0
                            size-32
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-full
                            bg-amber-300/10
                            blur-3xl
                        "
                    />

                    <div className="relative">
                        <div
                            className="
                                mx-auto flex size-12
                                items-center justify-center
                                rounded-2xl
                                border
                                border-amber-300/10
                                bg-amber-300/[0.05]
                                text-xl
                            "
                        >
                            ⏳
                        </div>

                        <h3
                            className="
                                mt-4 text-base
                                font-medium
                                text-amber-100/90
                            "
                        >
                            Feedback limit reached
                        </h3>

                        <p
                            className="
                                mx-auto mt-2
                                max-w-md
                                text-sm leading-6
                                text-white/40
                            "
                        >
                            You have reached the
                            maximum number of feedback
                            submissions allowed in the
                            current 24-hour period.
                        </p>

                        <div
                            className="
                                mt-5 inline-flex
                                items-center gap-2
                                rounded-xl
                                border
                                border-white/[0.06]
                                bg-black/20
                                px-4 py-2
                            "
                        >
                            <span className="text-xs text-white/30">
                                Available again in
                            </span>

                            <span
                                className="
                                    font-mono text-sm
                                    font-medium
                                    text-amber-100/80
                                "
                            >
                                {formatRetryTime(
                                    remainingSeconds
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/*
             * ======================================================
             * NORMAL ERROR
             * ======================================================
             */}

            {error && !isRateLimited && (
                <div
                    role="alert"
                    className="
                        rounded-2xl
                        border border-red-400/10
                        bg-red-400/[0.04]
                        px-4 py-3
                        text-sm leading-6
                        text-red-200/80
                    "
                >
                    {error}
                </div>
            )}

            {/*
             * ======================================================
             * CATEGORY
             * ======================================================
             */}

            <section
                className="
                    rounded-3xl
                    border border-white/[0.08]
                    bg-white/[0.025]
                    p-5 backdrop-blur-xl
                    sm:p-7
                "
            >
                <FeedbackCategory
                    value={type}
                    onChange={setType}
                />
            </section>

            {/*
             * ======================================================
             * RATINGS
             * ======================================================
             */}

            <section
                className="
                    rounded-3xl
                    border border-white/[0.08]
                    bg-white/[0.025]
                    p-5 backdrop-blur-xl
                    sm:p-7
                "
            >
                <FeedbackRating
                    type={type}
                    ratings={ratings}
                    onChange={updateRating}
                />
            </section>

            {/*
             * ======================================================
             * PROBLEMS
             * ======================================================
             */}

            <section
                className="
                    rounded-3xl
                    border border-white/[0.08]
                    bg-white/[0.025]
                    p-5 backdrop-blur-xl
                    sm:p-7
                "
            >
                <FeedbackProblems
                    selected={problems}
                    onToggle={toggleProblem}
                />
            </section>

            {/*
             * ======================================================
             * COMMENT
             * ======================================================
             */}

            <section
                className="
                    rounded-3xl
                    border border-white/[0.08]
                    bg-white/[0.025]
                    p-5 backdrop-blur-xl
                    sm:p-7
                "
            >
                <label
                    htmlFor="feedback-comment"
                    className="
                        block text-sm
                        font-medium
                        text-white/80
                    "
                >
                    Tell us more

                    <span className="ml-2 text-xs text-white/30">
                        Optional
                    </span>
                </label>

                <textarea
                    id="feedback-comment"
                    value={comment}
                    onChange={(event) =>
                        setComment(
                            event.target.value
                        )
                    }
                    maxLength={5000}
                    rows={5}
                    placeholder="What did you like? What could we improve?"
                    disabled={isRateLimited}
                    className="
                        mt-3 w-full resize-none
                        rounded-2xl
                        border border-white/[0.08]
                        bg-black/20
                        px-4 py-3
                        text-sm leading-6
                        text-white outline-none
                        placeholder:text-white/25
                        focus:border-cyan-300/20
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                />

                <div
                    className="
                        mt-2 text-right
                        text-[11px] text-white/25
                    "
                >
                    {comment.length}/5000
                </div>
            </section>

            {/*
             * ======================================================
             * FEATURE SUGGESTION
             * ======================================================
             */}

            {type === "feature" && (
                <section
                    className="
                        rounded-3xl
                        border border-white/[0.08]
                        bg-white/[0.025]
                        p-5 backdrop-blur-xl
                        sm:p-7
                    "
                >
                    <label
                        htmlFor="feature-suggestion"
                        className="
                            block text-sm
                            font-medium
                            text-white/80
                        "
                    >
                        What feature would you like?
                    </label>

                    <textarea
                        id="feature-suggestion"
                        value={featureSuggestion}
                        onChange={(event) =>
                            setFeatureSuggestion(
                                event.target.value
                            )
                        }
                        maxLength={3000}
                        rows={4}
                        disabled={isRateLimited}
                        placeholder="Tell us about your idea..."
                        className="
                            mt-3 w-full resize-none
                            rounded-2xl
                            border border-white/[0.08]
                            bg-black/20
                            px-4 py-3
                            text-sm leading-6
                            text-white outline-none
                            placeholder:text-white/25
                            focus:border-cyan-300/20
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    />

                    <div
                        className="
                            mt-2 text-right
                            text-[11px] text-white/25
                        "
                    >
                        {featureSuggestion.length}/3000
                    </div>
                </section>
            )}

            {/*
             * ======================================================
             * SUBMIT
             * ======================================================
             */}

            <button
                type="submit"
                disabled={submitDisabled}
                className="
                    h-12 w-full
                    rounded-2xl
                    bg-white
                    text-sm font-medium
                    text-black
                    transition
                    hover:bg-white/90
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                "
            >
                {isSubmitting
                    ? "Sending feedback..."
                    : isRateLimited
                        ? `Available in ${formatRetryTime(
                            remainingSeconds
                        )}`
                        : "Send feedback"}
            </button>
        </form>
    );
}