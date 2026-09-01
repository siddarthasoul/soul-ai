import redis from "../config/redis.js";
import quotaService from "../redis/quota.service.js";

const KEY =
    "test:quota:guest:123";

const LIMIT = 5;
const WINDOW_SECONDS = 60;

async function test(): Promise<void> {
    console.log(
        "Testing quota service...\n"
    );

    /**
     * Make sure Redis is connected.
     */
    const client =
        redis.getClient();

    if (!client.isOpen) {
        await client.connect();
    }

    /**
     * Start clean.
     */
    await quotaService.reset(KEY);

    /**
     * Consume 5 messages.
     */
    for (
        let i = 1;
        i <= 6;
        i++
    ) {
        const result =
            await quotaService.consume(
                KEY,
                LIMIT,
                WINDOW_SECONDS
            );

        console.log(
            `Message ${i}:`,
            {
                allowed:
                    result.allowed,
                used:
                    result.used,
                remaining:
                    result.remaining,
            }
        );
    }

    /**
     * Read quota without consuming.
     */
    const current =
        await quotaService.get(
            KEY,
            LIMIT
        );

    console.log(
        "\nCurrent quota:",
        current
    );

    /**
     * Reset quota.
     */
    await quotaService.reset(KEY);

    const afterReset =
        await quotaService.get(
            KEY,
            LIMIT
        );

    console.log(
        "\nAfter reset:",
        afterReset
    );

    console.log(
        "\nQuota test completed."
    );

    await client.quit();
}

test().catch(
    async (error) => {
        console.error(
            "\nQuota test failed:",
            error
        );

        const client =
            redis.getClient();

        if (client.isOpen) {
            await client.quit();
        }

        process.exit(1);
    }
);