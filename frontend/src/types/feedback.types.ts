export type MessageFeedbackReason =
    | "helpful"
    | "relevant"
    | "clear"
    | "good_reasoning"
    | "fast"
    | "incorrect"
    | "not_relevant"
    | "poor_reasoning"
    | "unclear"
    | "incomplete"
    | "too_slow"
    | "other";

export type MessageFeedbackOverall =
    | "good"
    | "bad";

export interface MessageFeedbackInput {
    liked: boolean;
    reasons: MessageFeedbackReason[];
    overall: MessageFeedbackOverall;
    comment?: string;
}









///////////////////////////


export type FeedbackType =
    | "general"
    | "ai"
    | "chat"
    | "ui"
    | "performance"
    | "bug"
    | "feature";

export type FeedbackProblem =
    | "ai_quality"
    | "ui"
    | "bug"
    | "speed"
    | "chat"
    | "feature"
    | "other";

/**
 * Individual ratings sent by the frontend.
 *
 * `overall` is NOT included.
 * The backend calculates the overall rating.
 */
export interface FeedbackRatings {
    // AI Experience
    accuracy?: number;
    relevance?: number;
    clarity?: number;
    completeness?: number;
    reasoning?: number;
    formatting?: number;
    speed?: number;

    // Chat Experience
    conversationFlow?: number;
    memory?: number;
    streaming?: number;
    composer?: number;

    // UI / UX
    design?: number;
    navigation?: number;
    easeOfUse?: number;
    responsiveness?: number;
    animations?: number;

    // Performance
    pageLoading?: number;
    stability?: number;
}

/**
 * Automatically collected client metadata.
 */
export interface FeedbackMetadata {
    browser?: string;
    os?: string;

    device?:
        | "desktop"
        | "tablet"
        | "mobile"
        | "unknown";

    screenWidth?: number;
    screenHeight?: number;

    appVersion?: string;
    page?: string;
}

/**
 * Data sent when creating feedback.
 *
 * This must match createFeedbackSchema.
 */
export interface CreateFeedbackInput {
    type: FeedbackType;

    ratings: FeedbackRatings;

    comment?: string;

    problems?: FeedbackProblem[];

    featureSuggestion?: string;

    attachments?: string[];

    metadata?: FeedbackMetadata;
}

/**
 * Backend feedback status.
 */
export type FeedbackStatus =
    | "new"
    | "reviewing"
    | "resolved"
    | "closed";

/**
 * Backend feedback priority.
 */
export type FeedbackPriority =
    | "low"
    | "medium"
    | "high"
    | "critical";

/**
 * Feedback returned by the backend.
 *
 * Notice that `overall` IS present here because
 * the backend calculates and stores it.
 */
export interface Feedback {
    id: string;

    type: FeedbackType;

    ratings: FeedbackRatings & {
        overall?: number | null;
    };

    comment?: string;

    problems?: FeedbackProblem[];

    featureSuggestion?: string;

    attachments?: string[];

    metadata?: FeedbackMetadata;

    status?: FeedbackStatus;

    priority?: FeedbackPriority;

    createdAt?: string;

    updatedAt?: string;
}