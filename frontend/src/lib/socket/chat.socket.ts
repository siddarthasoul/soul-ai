"use client";

import { io, type Socket } from "socket.io-client";

import type {
    ChatStartEvent,
    ChatChunkEvent,
    ChatCompleteEvent,
    ChatErrorEvent,
} from "@/src/types/chat";

interface ServerToClientEvents {
    chat_start: (data: ChatStartEvent) => void;
    chat_chunk: (data: ChatChunkEvent) => void;
    chat_complete: (data: ChatCompleteEvent) => void;
    chat_error: (data: ChatErrorEvent) => void;
}

interface ClientToServerEvents {
    join_conversation: (conversationId: string) => void;
    leave_conversation: (conversationId: string) => void;
    send_message: (data: {
        conversationId: string;
        content: string;
    }) => void;
}

export type ChatSocket = Socket<
    ServerToClientEvents,
    ClientToServerEvents
>;

// Singleton socket state.
let socket: ChatSocket | null = null;
let joinedConversationId: string | null = null;
let joiningConversationId: string | null = null;


export function getSocket(): ChatSocket {
if (socket) {
return socket;
}


const client: ChatSocket = io(
    process.env.NEXT_PUBLIC_SOCKET_URL ??
        "http://localhost",
    {
        withCredentials: true,
        transports: ["websocket", "polling"],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
    }
);

client.on("connect", () => {
    console.log(
        "[socket] connected:",
        client.id
    );

    if (joiningConversationId) {
        client.emit(
            "join_conversation",
            joiningConversationId
        );
    }
});

client.on("chat_start", (data) => {
    joinedConversationId =
        data.conversationId;

    joiningConversationId =
        data.conversationId;

    console.log(
        "[socket] joined:",
        data.conversationId
    );
});

client.on("chat_error", (data) => {
    if (data.code === "JOIN_FAILED") {
        if (
            data.conversationId ===
            joiningConversationId
        ) {
            joinedConversationId = null;
            joiningConversationId = null;
        }
    }

    console.error(
        "[socket] chat error:",
        data.code,
        data.message
    );
});

client.on("connect_error", (error) => {
    console.error(
        "[socket] connection error:",
        error.message
    );
});

client.on("disconnect", (reason) => {
    console.log(
        "[socket] disconnected:",
        reason
    );

    joinedConversationId = null;
});

socket = client;

return client;


}


export function connectSocket(): ChatSocket {
    const client = getSocket();

    if (!client.connected) {
        client.connect();
    }

    return client;
}

export function joinConversation(
    conversationId: string
): Promise<void> {
    if (!conversationId) {
        return Promise.reject(
            new Error("Conversation ID is required")
        );
    }

    const client = connectSocket();

    if (
        client.connected &&
        joinedConversationId === conversationId
    ) {
        return Promise.resolve();
    }

    joiningConversationId = conversationId;

    return new Promise((resolve, reject) => {
        let settled = false;

        const cleanup = () => {
            client.off(
                "chat_start",
                handleChatStart
            );

            client.off(
                "chat_error",
                handleChatError
            );

            client.off(
                "connect_error",
                handleConnectError
            );
        };

        const finishResolve = () => {
            if (settled) return;

            settled = true;
            cleanup();
            resolve();
        };

        const finishReject = (error: Error) => {
            if (settled) return;

            settled = true;
            cleanup();

            if (
                joiningConversationId ===
                conversationId
            ) {
                joiningConversationId = null;
            }

            reject(error);
        };

        const handleChatStart = (
            data: ChatStartEvent
        ) => {
            if (
                data.conversationId !==
                conversationId
            ) {
                return;
            }

            joinedConversationId = conversationId;
            joiningConversationId = conversationId;

            finishResolve();
        };

        const handleChatError = (
            data: ChatErrorEvent
        ) => {
            if (
                data.conversationId !==
                conversationId
            ) {
                return;
            }

            if (
                data.code !== "JOIN_FAILED"
            ) {
                return;
            }

            finishReject(
                new Error(
                    data.message ||
                    "Unable to join conversation"
                )
            );
        };

        const handleConnectError = (
            error: Error
        ) => {
            finishReject(error);
        };

        client.once(
            "chat_start",
            handleChatStart
        );

        client.once(
            "chat_error",
            handleChatError
        );

        client.once(
            "connect_error",
            handleConnectError
        );

        client.emit(
            "join_conversation",
            conversationId
        );
    });
}

export function isConversationJoined(
    conversationId: string
): boolean {
    return (
        socket?.connected === true &&
        joinedConversationId === conversationId
    );
}

export function leaveConversation(
    conversationId: string
): void {
    if (!conversationId || !socket?.connected) {
        return;
    }

    socket.emit(
        "leave_conversation",
        conversationId
    );

    if (
        joinedConversationId ===
        conversationId
    ) {
        joinedConversationId = null;
    }

    if (
        joiningConversationId ===
        conversationId
    ) {
        joiningConversationId = null;
    }
}

export function sendChatMessage(
    conversationId: string,
    content: string
): void {
    const client = getSocket();
    const value = content.trim();

    if (!client.connected) {
        throw new Error(
            "Chat socket is not connected"
        );
    }

    if (
        joinedConversationId !==
        conversationId
    ) {
        throw new Error(
            "Conversation is not joined"
        );
    }

    if (!value) {
        return;
    }

    client.emit("send_message", {
        conversationId,
        content: value,
    });
}

export function disconnectSocket(): void {
    if (!socket) {
        return;
    }

    joinedConversationId = null;
    joiningConversationId = null;

    if (socket.connected) {
        socket.disconnect();
    }
}

export function destroySocket(): void {
    if (!socket) {
        return;
    }

    joinedConversationId = null;
    joiningConversationId = null;

    socket.disconnect();
    socket.removeAllListeners();

    socket = null;
}