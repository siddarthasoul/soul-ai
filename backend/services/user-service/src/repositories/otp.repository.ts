import cache from "../../../../packages/common/redis/redis.repository.js";

export class OtpRepository {

    private readonly prefix = "otp";

    private getKey(email: string): string {
        return `${this.prefix}:${email}`;
    }

    async saveOtp(
        email: string,
        otp: string,
        ttl = 300
    ): Promise<void> {
        await cache.set(
            this.getKey(email),
            otp,
            ttl
        );
    }

    async getOtp(
        email: string
    ): Promise<string | null> {
        return cache.get(
            this.getKey(email)
        );
    }

    async deleteOtp(
        email: string
    ): Promise<void> {
        await cache.delete(
            this.getKey(email)
        );
    }
}


const otpRepository = new OtpRepository();

export default otpRepository