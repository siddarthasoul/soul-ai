"use client";

import type {
    CreateFeedbackInput,
} from "@/src/types/feedback.types";

type FeedbackProblem =
    NonNullable<
        CreateFeedbackInput["problems"]
    >[number];

interface FeedbackProblemsProps {
    selected: FeedbackProblem[];
    onToggle: (
        problem: FeedbackProblem
    ) => void;
}

const problems: {
    value: FeedbackProblem;
    label: string;
}[] = [
    {
        value: "ai_quality",
        label: "AI quality",
    },
    {
        value: "ui",
        label: "UI / design",
    },
    {
        value: "bug",
        label: "Bug",
    },
    {
        value: "speed",
        label: "Slow / performance",
    },
    {
        value: "chat",
        label: "Chat experience",
    },
    {
        value: "feature",
        label: "Missing feature",
    },
    {
        value: "other",
        label: "Other",
    },
];

export default function FeedbackProblems({
    selected,
    onToggle,
}: FeedbackProblemsProps) {
    return (
        <div className="space-y-3">
            <div>
                <h3 className="text-sm font-medium text-white">
                    What could be better?
                </h3>

                <p className="mt-1 text-xs text-white/35">
                    Select everything that applies.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {problems.map((problem) => {
                    const active =
                        selected.includes(
                            problem.value
                        );

                    return (
                        <button
                            key={problem.value}
                            type="button"
                            onClick={() =>
                                onToggle(
                                    problem.value
                                )
                            }
                            className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                                active
                                    ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100"
                                    : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:bg-white/[0.05]"
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <span
                                    className={`flex size-4 items-center justify-center rounded border ${
                                        active
                                            ? "border-cyan-300 bg-cyan-300"
                                            : "border-white/20"
                                    }`}
                                >
                                    {active && (
                                        <span className="text-[10px] text-black">
                                            ✓
                                        </span>
                                    )}
                                </span>

                                {problem.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}