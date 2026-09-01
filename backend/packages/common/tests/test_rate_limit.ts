import { connectInfrastructure } from "../config/connections.js";
import rateLimitService from "../redis/rate-limit.service.js";

const identifier = `test:${Date.now()}`;

async function test(): Promise<void> {
    try {
        await connectInfrastructure();

        console.log("Redis connected.");
        console.log("Testing rate limiter...\n");

        for (let i = 1; i <= 7; i++) {
            const result =
                await rateLimitService.check({
                    key: "chat",
                    identifier,
                    limit: 5,
                    windowSeconds: 60,
                });

            console.log(
                `Request ${i}:`,
                `allowed=${result.allowed}`,
                `remaining=${result.remaining}`,
                `retryAfter=${result.retryAfterSeconds}s`
            );
        }

        await rateLimitService.reset(
            "chat",
            identifier
        );

        console.log(
            "\nRate-limit test completed."
        );
    } catch (error) {
        console.error(
            "Rate-limit test failed:",
            error
        );

        process.exitCode = 1;
    }
}

await test();