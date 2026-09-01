import redis from "../../../../packages/common/config/redis.js";
import env from "../../../../packages/common/config/env.js";

export interface ChatMemoryMessage {
    role: "user" | "assistant";
    content: string;
}

class ChatMemoryService {


    private getKey(
        conversationId: string
    ): string {
        return `chat:memory:${conversationId}`;
    }

    async addMessages(
        conversationId: string,
        messages: ChatMemoryMessage[]
    ): Promise<void> {

        if (messages.length === 0) {
            return;
        }

        const key = this.getKey(conversationId);

        const client =
            redis.getClient();

        for (const message of messages) {

            await client.rPush(
                key,
                JSON.stringify(message)
            );
        }

        await client.lTrim(
            key,
            -env.chat.memory,
            -1
        );
    }

    async getMessages(
        conversationId: string
    ): Promise<ChatMemoryMessage[]> {

        const key = this.getKey(conversationId);

        const client = redis.getClient();

        const messages =
            await client.lRange(
                key,
                0,
                -1
            );

        return messages.map(
            (message) =>
                JSON.parse(
                    message
                ) as ChatMemoryMessage
        );
    }
}

const chatMemoryService =
    new ChatMemoryService();

export default chatMemoryService;