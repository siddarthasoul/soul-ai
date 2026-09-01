
import redis from "../config/redis.js";

export interface CachedUser {
    id: string;
    name?: string;
    email: string;
    isEmailVerified: boolean;
}

class UserCacheService {

    private getKey(userId: string): string {
        return `user:${userId}`;
    }

    async set(
        user: CachedUser,
        ttl: number
    ): Promise<void> {

        const key = this.getKey(user.id);

        await redis
            .getClient()
            .set(
                key,
                JSON.stringify(user),
                {
                    EX: ttl,
                }
            );
    }

    async get(
        userId: string
    ): Promise<CachedUser | null> {

        const key = this.getKey(userId);

        const data =
            await redis
                .getClient()
                .get(key);

        if (!data) {
            return null;
        }

        try {
            return JSON.parse(data) as CachedUser;
        } catch {
            await this.delete(userId);
            return null;
        }
    }

    async delete(
        userId: string
    ): Promise<void> {

        await redis
            .getClient()
            .del(
                this.getKey(userId)
            );
    }
}

const userCacheService =
    new UserCacheService();

export default userCacheService;
