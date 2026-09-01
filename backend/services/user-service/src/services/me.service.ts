import { ApiError } from "../../../../packages/common/utils/apiError.js";
import userCacheService from "../../../../packages/common/redis/user-cache.service.js";
import sessionService from "./session.service.js";

class MeService {

    async getCurrentUser(
        sessionId: string
    ) {

        console.log(
            "[ME SERVICE] sessionId:",
            sessionId
        );

        const userId =
            await sessionService.getUserId(
                sessionId
            );

        console.log(
            "[ME SERVICE] userId:",
            userId
        );

        if (!userId) {
            throw new ApiError(
                401,
                "Session expired or invalid"
            );
        }

        const user =
            await userCacheService.get(
                userId
            );

        console.log(
            "[ME SERVICE] cached user:",
            user
        );

        if (!user) {
            throw new ApiError(
                401,
                "User session expired"
            );
        }

        return user;
    }
}

const meService =
    new MeService();

export default meService;