"use client";

import type {
    CreateFeedbackInput,
} from "@/src/types/feedback.types";

type FeedbackRatings =
    CreateFeedbackInput["ratings"];

interface FeedbackRatingProps {
    type?: CreateFeedbackInput["type"];
    ratings: FeedbackRatings;
    onChange: (
        key: keyof FeedbackRatings,
        value: number
    ) => void;
}

const ratingLabels = [
    "accuracy",
    "relevance",
    "clarity",
    "completeness",
    "reasoning",
    "formatting",
    "speed",
    "conversationFlow",
    "memory",
    "streaming",
    "composer",
    "design",
    "navigation",
    "easeOfUse",
    "responsiveness",
    "animations",
    "pageLoading",
    "stability",
] as const;

export default function FeedbackRating({
    ratings,
    onChange,
}: FeedbackRatingProps) {
    return (
        <div className="space-y-5">
            {ratingLabels.map((key) => (
                <div
                    key={key}
                    className="space-y-2"
                >
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-white/70">
                            {formatLabel(key)}
                        </label>

                        <span className="text-xs text-white/35">
                            {ratings[key] ?? 0}/5
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(
                            (value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() =>
                                        onChange(
                                            key,
                                            value
                                        )
                                    }
                                    className={`flex size-9 items-center justify-center rounded-full border text-sm transition ${
                                        ratings[key] ===
                                        value
                                            ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-200"
                                            : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white"
                                    }`}
                                >
                                    {value}
                                </button>
                            )
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function formatLabel(value: string) {
    return value
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (char) =>
            char.toUpperCase()
        );
}