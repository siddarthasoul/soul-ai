import cache from "../../../../packages/common/redis/redis.repository.js";

class SessionRepository {

    private getSessionKey(sessionId: string): string {
        return `session:${sessionId}`;
    }

    private getUserSessionKey(userId: string): string {
        return `user:session:${userId}`;
    }

    async create(
        sessionId: string,
        userId: string,
        ttl: number
    ): Promise<void> {

        await cache.set(
            this.getSessionKey(sessionId),
            userId,
            ttl
        );

        await cache.set(
            this.getUserSessionKey(userId),
            sessionId,
            ttl
        );
    }

    async getUserId(
        sessionId: string
    ): Promise<string | null> {

        return cache.get(
            this.getSessionKey(sessionId)
        );
    }

    async getSessionId(
        userId: string
    ): Promise<string | null> {

        return cache.get(
            this.getUserSessionKey(userId)
        );
    }

    async delete(
        sessionId: string,
        userId: string
    ): Promise<void> {

        await cache.delete(
            this.getSessionKey(sessionId)
        );

        await cache.delete(
            this.getUserSessionKey(userId)
        );
    }

    async deleteUserSession(
        userId: string
    ): Promise<void> {

        const sessionId =
            await this.getSessionId(userId);

        if (!sessionId) {
            return;
        }

        await this.delete(
            sessionId,
            userId
        );
    }
}

const sessionRepository =
    new SessionRepository();

export default sessionRepository;