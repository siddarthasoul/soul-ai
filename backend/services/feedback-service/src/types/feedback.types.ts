import type { Types } from "mongoose";

/**
 * Feedback category
 */
export type FeedbackType =
    | "general"
    | "ai"
    | "chat"
    | "ui"
    | "performance"
    | "bug"
    | "feature";

/**
 * Feedback status
 */
export type FeedbackStatus =
    | "new"
    | "reviewing"
    | "resolved"
    | "closed";

/**
 * Feedback priority
 */
export type FeedbackPriority =
    | "low"
    | "medium"
    | "high"
    | "critical";

/**
 * Problems reported by the user
 */
export type FeedbackProblem =
    | "ai_quality"
    | "ui"
    | "bug"
    | "speed"
    | "chat"
    | "feature"
    | "other";

/**
 * Device type
 */
export type FeedbackDevice =
    | "desktop"
    | "tablet"
    | "mobile"
    | "unknown";

/**
 * All possible ratings.
 *
 * Every field is optional because different
 * feedback types may use different ratings.
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
 * Automatically collected client information.
 */
export interface FeedbackMetadata {
    browser?: string;
    os?: string;
    device?: FeedbackDevice;
    screenWidth?: number;
    screenHeight?: number;
    appVersion?: string;
    page?: string;
}

/**
 * Main Feedback entity
 */
export interface Feedback {
    _id: Types.ObjectId;

    userId?: Types.ObjectId | null;

    guestId?: string | null;

    type: FeedbackType;

    ratings: FeedbackRatings;

    /**
     * Calculated by backend.
     */
    overall?: number;

    comment?: string;

    problems?: FeedbackProblem[];

    featureSuggestion?: string;

    attachments?: string[];

    metadata?: FeedbackMetadata;

    status: FeedbackStatus;

    priority: FeedbackPriority;

    /**
     * Internal admin-only notes.
     */
    internalNotes?: string;

    createdAt: Date;
    updatedAt: Date;
}

/**
 * Data accepted when creating feedback.
 *
 * Notice:
 * - no _id
 * - no overall
 * - no status
 * - no priority
 * - no internalNotes
 *
 * These are controlled by the backend.
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
 * Data allowed when updating feedback.
 *
 * Keep this separate from CreateFeedbackInput.
 */
export interface UpdateFeedbackInput {
    ratings?: FeedbackRatings;

    comment?: string;

    problems?: FeedbackProblem[];

    featureSuggestion?: string;

    attachments?: string[];
}