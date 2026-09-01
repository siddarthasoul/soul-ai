export type ChatMessageRole =
    | "user"
    | "assistant";

export interface MessageResponse {
    id: string;
    conversationId: string;
    role: ChatMessageRole;
    content: string;
    model: string | null;
    createdAt: Date;
}


export interface ChatUsage {
    promptTokens?: number | null;
    completionTokens?: number | null;
    totalTokens?: number | null;

    totalDurationMs?: number | null;
    loadDurationMs?: number | null;
    promptEvalDurationMs?: number | null;
    evalDurationMs?: number | null;

    tokensPerSecond?: number | null;
}









// message feedback 


export const messageFeedbackReasons = [
    "helpful",
    "relevant",
    "clear",
    "good_reasoning",
    "fast",
    "incorrect",
    "not_relevant",
    "poor_reasoning",
    "unclear",
    "incomplete",
    "too_slow",
    "other",
] as const;

export type MessageFeedbackReason =
    (typeof messageFeedbackReasons)[number];

export interface MessageFeedbackInput {
    liked: boolean;

    reasons?: MessageFeedbackReason[];

    overall?: "good" | "bad";

    comment?: string;
}