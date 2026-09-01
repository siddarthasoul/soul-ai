
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
    Conversation,
    Message,
    ChatErrorEvent,
    RateLimitResult,
} from "@/src/types/chat";

interface ChatState {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    messages: Message[];

    streamingContent: string;
    isStreaming: boolean;

    isLoadingConversations: boolean;
    isLoadingMessages: boolean;

    error: string | null;
    errorCode: ChatErrorEvent["code"];

    // This is the ONLY chat-related data persisted.
    rateLimit: RateLimitResult | null;

    setConversations: (
        conversations: Conversation[]
    ) => void;

    addConversation: (
        conversation: Conversation
    ) => void;

    setActiveConversation: (
        conversation: Conversation | null
    ) => void;

    setMessages: (
        messages: Message[]
    ) => void;

    addMessage: (
        message: Message
    ) => void;

    startStreaming: () => void;

    appendStreamingContent: (
        content: string
    ) => void;

    finishStreaming: (
        message: Message
    ) => void;

    setLoadingConversations: (
        loading: boolean
    ) => void;

    setLoadingMessages: (
        loading: boolean
    ) => void;

    setError: (
        error: string | null,
        code?: ChatErrorEvent["code"]
    ) => void;

    setRateLimit: (
        rateLimit: RateLimitResult
    ) => void;

    clearError: () => void;

    clearChat: () => void;
}

export const useChatStore =
    create<ChatState>()(
        persist(
            (set) => ({

                // ==================================================
                // STATE
                // ==================================================

                conversations: [],

                activeConversation: null,

                messages: [],

                streamingContent: "",

                isStreaming: false,

                isLoadingConversations: false,

                isLoadingMessages: false,

                error: null,

                errorCode: undefined,

                rateLimit: null,

                // ==================================================
                // CONVERSATIONS
                // ==================================================

                setConversations: (
                    conversations
                ) =>
                    set({
                        conversations,
                    }),

                addConversation: (
                    conversation
                ) =>
                    set((state) => ({
                        conversations: [
                            conversation,
                            ...state.conversations.filter(
                                (item) =>
                                    item.id !==
                                    conversation.id
                            ),
                        ],
                    })),

                setActiveConversation: (
                    conversation
                ) =>
                    set({
                        activeConversation:
                            conversation,

                        // Chat messages are NEVER
                        // persisted in localStorage.
                        messages: [],

                        streamingContent: "",

                        isStreaming: false,

                        error: null,

                        errorCode: undefined,
                    }),

                // ==================================================
                // MESSAGES
                // ==================================================

                setMessages: (
                    messages
                ) =>
                    set({
                        messages,
                    }),

                addMessage: (
                    message
                ) =>
                    set((state) => ({
                        messages: [
                            ...state.messages,
                            message,
                        ],
                    })),

                // ==================================================
                // STREAMING
                // ==================================================

                startStreaming: () =>
                    set({
                        streamingContent: "",

                        isStreaming: true,

                        error: null,

                        errorCode: undefined,
                    }),

                appendStreamingContent: (
                    content
                ) =>
                    set((state) => ({
                        streamingContent:
                            state.streamingContent +
                            content,
                    })),

                finishStreaming: (
                    message
                ) =>
                    set((state) => ({
                        messages: [
                            ...state.messages,
                            message,
                        ],

                        streamingContent: "",

                        isStreaming: false,

                        error: null,

                        errorCode: undefined,
                    })),

                // ==================================================
                // LOADING
                // ==================================================

                setLoadingConversations: (
                    loading
                ) =>
                    set({
                        isLoadingConversations:
                            loading,
                    }),

                setLoadingMessages: (
                    loading
                ) =>
                    set({
                        isLoadingMessages:
                            loading,
                    }),

                // ==================================================
                // ERROR
                // ==================================================

                setError: (
                    error,
                    code
                ) =>
                    set({
                        error,

                        errorCode: code,

                        isStreaming: false,

                        streamingContent: "",
                    }),

                clearError: () =>
                    set({
                        error: null,

                        errorCode: undefined,
                    }),

                // ==================================================
                // RATE LIMIT
                // ==================================================

                setRateLimit: (
                    rateLimit
                ) =>
                    set({
                        rateLimit,
                    }),

                // ==================================================
                // CLEAR CHAT
                // ==================================================

                clearChat: () =>
                    set({
                        activeConversation: null,

                        messages: [],

                        streamingContent: "",

                        isStreaming: false,

                        error: null,

                        errorCode: undefined,

                        // Do NOT clear rateLimit.
                        //
                        // Rate limit belongs to the
                        // user/guest, not conversation.
                    }),
            }),

            {
                // Zustand persist storage.
                name: "soul-chat-store",

                // ==================================================
                // IMPORTANT
                // ==================================================
                //
                // ONLY rateLimit is stored in localStorage.
                //
                // NEVER store:
                // conversations
                // activeConversation
                // messages
                // streamingContent
                // isStreaming
                // errors
                //
                // Those exist only in frontend memory and
                // conversations/messages come from backend.
                // ==================================================

                partialize: (state) => ({
                    rateLimit: state.rateLimit,
                }),
            }
        )
    );

export default useChatStore;
