export type ConversationOwnerType =
    | "user"
    | "guest";


export interface ConversationOwner {
    type: ConversationOwnerType;

    userId: string | null;

    guestId: string | null;
}


export interface Conversation {
    id: string;

    owner: ConversationOwner;

    title: string | null;

    createdAt: string;

    updatedAt: string;

    lastMessageAt?: string | null;
}


// ============================================================
// USAGE
// ============================================================

export interface ChatUsage {
    promptTokens?: number;

    completionTokens?: number;

    totalTokens?: number;
}


// ============================================================
// MESSAGE
// ============================================================

export interface Message {
    id: string;
    conversationId: string;

    userId: string | null;
    guestId: string | null;

    role: "user" | "assistant";

    content: string;

    model: string | null;

    usage: ChatUsage | null;

    liked: boolean | null;

    createdAt: string;
    updatedAt: string;
}


// ============================================================
// CREATE CONVERSATION
// ============================================================

export interface CreateConversationInput {
    title?: string;
}


export interface SendMessageInput {
    conversationId: string;

    content: string;
}


// ============================================================
// RATE LIMIT
// ============================================================

export interface RateLimitResult {
    allowed: boolean;

    limit: number;

    remaining: number;

    retryAfterSeconds: number;
}


// ============================================================
// CREATE CONVERSATION RESPONSE
// ============================================================

export interface CreateConversationResponse {
    conversation: Conversation;
    rateLimit: RateLimitResult;
}


// ============================================================
// SOCKET EVENTS
// ============================================================

export interface ChatStartEvent {
    conversationId: string;
}


export interface ChatChunkEvent {
    conversationId: string;

    content: string;
}


export interface ChatCompleteEvent {
    conversationId: string;

    messageId: string;

    model: string;

    usage?: ChatUsage;

    rateLimit: RateLimitResult;
}


export interface ChatErrorEvent {
    conversationId?: string;

    message: string;

    code?:
        | "JOIN_FAILED"
        | "RATE_LIMITED"
        | "AUTH_FAILED"
        | "AI_ERROR"
        | "CHAT_ERROR";
}