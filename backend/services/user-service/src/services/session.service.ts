import { randomBytes } from "node:crypto";
import sessionRepository
    from "../repositories/session.repository.js";
import env from "../../../../packages/common/config/env.js";

class SessionService {

    async createSession(
        userId: string
    ): Promise<string> {

        // Only one active session per user
        await sessionRepository.deleteUserSession(
            userId
        );

        const sessionId =
            randomBytes(32).toString("hex");

        await sessionRepository.create(
            sessionId,
            userId,
            env.auth.session.ttlSeconds
        );

        return sessionId;
    }

    async getUserId(
        sessionId: string
    ): Promise<string | null> {

        return sessionRepository.getUserId(
            sessionId
        );
    }

    async deleteSession(
        sessionId: string,
        userId: string
    ): Promise<void> {

        await sessionRepository.delete(
            sessionId,
            userId
        );
    }
}

const sessionService =
    new SessionService();

export default sessionService;