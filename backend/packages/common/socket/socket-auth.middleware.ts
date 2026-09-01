import type { Socket } from "socket.io";
import { randomUUID } from "node:crypto";

import sessionRepository from "../../../services/user-service/src/repositories/session.repository.js";

import type { ChatIdentity } from "../../../packages/common/middlewares/identity.middleware.js";

interface SocketAuthError extends Error {
    data?: {
        code: string;
    };
}

export async function socketAuthMiddleware(
    socket: Socket,
    next: (err?: Error) => void
): Promise<void> {
    try {
        const identity = await resolveIdentity(socket);

        socket.data.identity = identity;

        next();
    } catch (error) {
        console.error(
            "[Socket Auth] Authentication failed:",
            error
        );

        const authError = new Error(
            "Socket authentication failed"
        ) as SocketAuthError;

        authError.data = {
            code: "AUTH_FAILED",
        };

        next(authError);
    }
}

async function resolveIdentity(
    socket: Socket
): Promise<ChatIdentity> {
    const sessionId = getCookie(
        socket.handshake.headers.cookie,
        "sessionId"
    );

    /*
     * Registered user
     */
    if (sessionId) {
        const userId =
            await sessionRepository.getUserId(
                sessionId
            );

        if (userId) {
            return {
                userId,
            };
        }
    }

    /*
     * Existing guest
     */
    const existingGuestId =
        getCookie(
            socket.handshake.headers.cookie,
            "guestId"
        );

    if (existingGuestId) {
        return {
            guestId: existingGuestId,
        };
    }

    /*
     * New guest
     *
     * Important:
     * Socket.IO cannot automatically set
     * an HTTP cookie from here.
     *
     * For a new guest, return the generated ID
     * through socket.data for now.
     */
    return {
        guestId: randomUUID(),
    };
}

function getCookie(
    cookieHeader: string | undefined,
    name: string
): string | undefined {
    if (!cookieHeader) {
        return undefined;
    }

    const cookies = cookieHeader
        .split(";")
        .map((cookie) => cookie.trim());

    for (const cookie of cookies) {
        const separatorIndex =
            cookie.indexOf("=");

        if (separatorIndex === -1) {
            continue;
        }

        const key =
            cookie.slice(0, separatorIndex);

        const value =
            cookie.slice(separatorIndex + 1);

        if (key === name) {
            return decodeURIComponent(value);
        }
    }

    return undefined;
}