
import {
    Server,
} from "socket.io";

import type {
    Server as HttpServer,
} from "node:http";

import {
    socketAuthMiddleware,
} from "./socket-auth.middleware.js";

import type {
    ChatIdentity,
} from "../../../packages/common/middlewares/identity.middleware.js";

import conversationRepository
    from "../../../services/chat-service/src/repositories/conversation.repository.js";

import chatService
    from "../../../services/chat-service/src/services/chat.service.js";

import type {
    RateLimitResult,
} from "../../../packages/common/redis/rate-limit.service.js";

/* -------------------------------------------------------------------------- */
/* Server → Client events                                                     */
/* -------------------------------------------------------------------------- */

interface ServerToClientEvents {
    chat_start: (
        data: {
            conversationId: string;
        }
    ) => void;

    chat_chunk: (
        data: {
            conversationId: string;
            content: string;
        }
    ) => void;

    chat_complete: (
        data: {
            conversationId: string;
            messageId: string;
            rateLimit: RateLimitResult;
        }
    ) => void;

    chat_error: (
        data: {
            conversationId?: string;
            message: string;
            code?:
            | "JOIN_FAILED"
            | "RATE_LIMITED"
            | "AUTH_FAILED"
            | "AI_ERROR"
            | "CHAT_ERROR";
        }
    ) => void;
}

/* -------------------------------------------------------------------------- */
/* Client → Server events                                                     */
/* -------------------------------------------------------------------------- */

interface ClientToServerEvents {
    join_conversation: (
        conversationId: string
    ) => void;

    leave_conversation: (
        conversationId: string
    ) => void;

    send_message: (
        data: {
            conversationId: string;
            content: string;
        }
    ) => void;
}

/* -------------------------------------------------------------------------- */
/* Inter-server events                                                        */
/* -------------------------------------------------------------------------- */

interface InterServerEvents { }

/* -------------------------------------------------------------------------- */
/* Socket data                                                                */
/* -------------------------------------------------------------------------- */

interface SocketData {
    identity?: ChatIdentity;
    conversationId?: string;
}

/* -------------------------------------------------------------------------- */
/* Socket server type                                                         */
/* -------------------------------------------------------------------------- */

type SocketServer = Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>;

/* -------------------------------------------------------------------------- */
/* Socket service                                                             */
/* -------------------------------------------------------------------------- */

export class SocketService {
    private static instance:
        | SocketServer
        | null = null;

    /* ---------------------------------------------------------------------- */
    /* Initialize                                                              */
    /* ---------------------------------------------------------------------- */

    public static initialize(
        httpServer: HttpServer
    ): SocketServer {
        if (SocketService.instance) {
            return SocketService.instance;
        }

        const io = new Server<
            ClientToServerEvents,
            ServerToClientEvents,
            InterServerEvents,
            SocketData
        >(
            httpServer,
            {
                cors: {
                    origin: "http://localhost:3000",
                    credentials: true,
                },

                pingTimeout: 60_000,
                pingInterval: 25_000,
            }
        );

        io.use(socketAuthMiddleware);

        SocketService.instance = io;

        SocketService.setupListeners();

        console.log(
            "[Socket] Socket.IO initialized"
        );

        return io;
    }

    /* ---------------------------------------------------------------------- */
    /* Connection listeners                                                    */
    /* ---------------------------------------------------------------------- */

    private static setupListeners(): void {
        const io =
            SocketService.getIO();

        io.on(
            "connection",
            (socket) => {
                console.log(
                    `[Socket] Connected: ${socket.id}`
                );

                console.log(
                    "[Socket] Identity:",
                    socket.data.identity
                );

                /* ---------------------------------------------------------- */
                /* Join conversation                                           */
                /* ---------------------------------------------------------- */

                socket.on(
                    "join_conversation",
                    async (
                        conversationId
                    ) => {
                        try {
                            const identity =
                                socket.data.identity;

                            if (!identity) {
                                socket.emit(
                                    "chat_error",
                                    {
                                        conversationId,
                                        code:
                                            "AUTH_FAILED",
                                        message:
                                            "Authentication required",
                                    }
                                );

                                return;
                            }

                            const conversation =
                                await conversationRepository
                                    .findByIdAndIdentity(
                                        conversationId,
                                        identity
                                    );

                            if (!conversation) {
                                console.log(
                                    `[Socket] Temporary conversation: ${conversationId}`
                                );
                            }

                            const previousConversation =
                                socket.data
                                    .conversationId;

                            if (
                                previousConversation &&
                                previousConversation !==
                                conversationId
                            ) {
                                socket.leave(
                                    SocketService
                                        .getRoomName(
                                            previousConversation
                                        )
                                );
                            }

                            const room =
                                SocketService
                                    .getRoomName(
                                        conversationId
                                    );

                            socket.join(room);

                            socket.data
                                .conversationId =
                                conversationId;

                            socket.emit(
                                "chat_start",
                                {
                                    conversationId,
                                }
                            );

                            console.log(
                                `[Socket] ${socket.id} joined ${room}`
                            );
                        } catch (error) {
                            console.error(
                                "[Socket] Join conversation error:",
                                error
                            );

                            socket.emit(
                                "chat_error",
                                {
                                    conversationId,
                                    code:
                                        "JOIN_FAILED",
                                    message:
                                        "Unable to join conversation",
                                }
                            );
                        }
                    }
                );

                /* ---------------------------------------------------------- */
                /* Send message                                                */
                /* ---------------------------------------------------------- */

                socket.on(
                    "send_message",
                    async (
                        data
                    ) => {
                        try {
                            const identity =
                                socket.data.identity;

                            if (!identity) {
                                socket.emit(
                                    "chat_error",
                                    {
                                        conversationId:
                                            data.conversationId,
                                        code:
                                            "AUTH_FAILED",
                                        message:
                                            "Authentication required",
                                    }
                                );

                                return;
                            }

                            if (
                                socket.data
                                    .conversationId !==
                                data.conversationId
                            ) {
                                socket.emit(
                                    "chat_error",
                                    {
                                        conversationId:
                                            data.conversationId,
                                        code:
                                            "CHAT_ERROR",
                                        message:
                                            "Join the conversation first",
                                    }
                                );

                                return;
                            }

                            const room =
                                SocketService
                                    .getRoomName(
                                        data.conversationId
                                    );

                            /* ------------------------------------------------ */
                            /* Stream response                                  */
                            /* ------------------------------------------------ */

                            for await (
                                const chunk of
                                chatService.streamMessage(
                                    identity,
                                    {
                                        conversationId:
                                            data.conversationId,
                                        content:
                                            data.content,
                                    }
                                )
                            ) {
                                /* -------------------------------------------- */
                                /* Final chunk                                  */
                                /* -------------------------------------------- */

                                if (chunk.done) {
                                    socket.emit(
                                        "chat_complete",
                                        {
                                            conversationId:
                                                data.conversationId,

                                            messageId:
                                                chunk.messageId ??
                                                "",

                                            rateLimit:
                                                chunk.rateLimit!,
                                        }
                                    );

                                    continue;
                                }

                                /* -------------------------------------------- */
                                /* Streaming content                            */
                                /* -------------------------------------------- */

                                if (chunk.content) {
                                    io.to(room).emit(
                                        "chat_chunk",
                                        {
                                            conversationId:
                                                data.conversationId,

                                            content:
                                                chunk.content,
                                        }
                                    );
                                }
                            }
                        } catch (error) {
                            console.error(
                                "[Socket] Send message error:",
                                error
                            );

                            const message =
                                error instanceof Error
                                    ? error.message
                                    : "Unable to process message";

                            const isRateLimited =
                                message.startsWith(
                                    "Too many requests"
                                );

                            socket.emit(
                                "chat_error",
                                {
                                    conversationId:
                                        data.conversationId,

                                    code:
                                        isRateLimited
                                            ? "RATE_LIMITED"
                                            : "AI_ERROR",

                                    message,
                                }
                            );
                        }
                    }
                );

                /* ---------------------------------------------------------- */
                /* Leave conversation                                          */
                /* ---------------------------------------------------------- */

                socket.on(
                    "leave_conversation",
                    (
                        conversationId
                    ) => {
                        const room =
                            SocketService
                                .getRoomName(
                                    conversationId
                                );

                        socket.leave(room);

                        if (
                            socket.data
                                .conversationId ===
                            conversationId
                        ) {
                            delete socket.data
                                .conversationId;
                        }

                        console.log(
                            `[Socket] ${socket.id} left ${room}`
                        );
                    }
                );

                /* ---------------------------------------------------------- */
                /* Disconnect                                                  */
                /* ---------------------------------------------------------- */

                socket.on(
                    "disconnect",
                    (
                        reason
                    ) => {
                        console.log(
                            `[Socket] Disconnected: ${socket.id}. Reason: ${reason}`
                        );
                    }
                );
            }
        );
    }

    /* ---------------------------------------------------------------------- */
    /* Room name                                                               */
    /* ---------------------------------------------------------------------- */

    private static getRoomName(
        conversationId: string
    ): string {
        return `conversation:${conversationId}`;
    }

    /* ---------------------------------------------------------------------- */
    /* Get Socket.IO instance                                                  */
    /* ---------------------------------------------------------------------- */

    public static getIO(): SocketServer {
        if (!SocketService.instance) {
            throw new Error(
                "[Socket] Socket.IO has not been initialized"
            );
        }

        return SocketService.instance;
    }
}
