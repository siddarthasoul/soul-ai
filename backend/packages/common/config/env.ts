import dotenv from "dotenv";

dotenv.config();

class Env {

    private getString(key: string, defaultValue?: string): string {
        const value = process.env[key];

        if (!value) {
            if (defaultValue !== undefined) return defaultValue;
            throw new Error(`Missing number environment variable: ${key}`);
        }
        return value;
    }

    private getNumber(key: string, defaultValue?: number): number {
        const value = process.env[key];

        if (!value) {
            if (defaultValue !== undefined) return defaultValue;
            throw new Error(`Missing number environment variable: ${key}`);
        }

        const number = Number(value);

        return number;
    }

    private getBoolean(key: string, defaultValue?: boolean): boolean {
        const value = process.env[key];

        if (!value) {
            return defaultValue ?? false;
        }

        return value.toLowerCase() === "true";
    }


    private require(key: string): string {
        const value = process.env[key];

        if (value === undefined || value.trim() === "") {
            throw new Error(`Missing required environment variable: ${key}`);
        }

        return value;
    }

    readonly app = {
        name: this.getString("APP_NAME", "Template"),
        env: this.getString("NODE_ENV", "development"),
        debug: this.getBoolean("DEBUG", false),
        apiPrefix: this.getString("API_V1_PREFIX", "/api/v1"),
        frontendUrl: this.getString("FRONTEND_URL"),
    };

    readonly server = {
        host: this.getString("HOST", "0.0.0.0"),
        port: this.getNumber("PORT", 8000),
    };

    readonly mongo = {
        uri: this.require("MONGO_URI"),
        database: this.require("MONGO_DB_NAME"),
    };

    readonly redis = {
        host: this.getString("REDIS_HOST"),
        port: this.getNumber("REDIS_PORT", 6379),
        username: this.getString(
            "REDIS_USERNAME",
            "default"
        ),
        password: this.getString(
            "REDIS_PASSWORD"
        ),
        db: this.getNumber(
            "REDIS_DB",
            0
        ),
        tls: this.getBoolean(
            "REDIS_TLS",
            true
        ),
    };

    readonly mail = {
        apiKey: this.require("BREVO_API_KEY"),
        from: this.require("MAIL_FROM"),
        fromName: this.getString("MAIL_FROM_NAME", "SOUL AI"),
    };


    readonly llm = {
        host: this.getString(
            "OLLAMA_HOST",
            "http://localhost:11434"
        ),

        model: this.getString(
            "LLM_MODEL",
            "soul-ai:latest"
        ),

        timeout: this.getNumber(
            "LLM_TIMEOUT",
            120_000
        ),
    };



    readonly auth = {
        otp: {
            ttlSeconds: this.getNumber("OTP_TTL_SECONDS", 300),
            maxAttempts: this.getNumber("OTP_MAX_ATTEMPTS", 5),
            rateLimit: this.getNumber("OTP_RATE_LIMIT", 3),
            rateWindowSeconds: this.getNumber("OTP_RATE_WINDOW_SECONDS", 3600),
        },

        session: {
            ttlSeconds: this.getNumber("SESSION_TTL_SECONDS", 2592000),
        },

        rateLimit: {
            windowSeconds: this.getNumber("RATE_LIMIT_WINDOW_SECONDS", 60),
            maxRequests: this.getNumber("RATE_LIMIT_MAX_REQUESTS", 100),
        },
    };

    readonly session = {

        secure: this.getBoolean("COOKIE_SECURE")

    }

    readonly chat = {
        memory: this.getNumber("MAX_MESSAGES", 20)
    }


    readonly otp = {
        requestLimit: this.getNumber(
            "OTP_REQUEST_LIMIT",
            3
        ),

        requestWindowSeconds: this.getNumber(
            "OTP_REQUEST_WINDOW_SECONDS",
            3600
        ),

        requestCooldownSeconds: this.getNumber(
            "OTP_REQUEST_COOLDOWN_SECONDS",
            60
        ),

        verifyAttemptLimit: this.getNumber(
            "OTP_VERIFY_ATTEMPT_LIMIT",
            5
        ),
    };

    readonly chatRateLimit = {
        guest: {
            limit: this.getNumber(
                "CHAT_GUEST_RATE_LIMIT",
                5
            ),
            windowSeconds: this.getNumber(
                "CHAT_GUEST_RATE_WINDOW_SECONDS",
                86400
            ),
        },

        user: {
            limit: this.getNumber(
                "CHAT_USER_RATE_LIMIT",
                20
            ),
            windowSeconds: this.getNumber(
                "CHAT_USER_RATE_WINDOW_SECONDS",
                60
            ),
        },
    };


    readonly feedback = {
        requestLimit:
            Number(
                process.env.FEEDBACK_REQUEST_LIMIT
            ) || 3,

        requestWindowSeconds:
            Number(
                process.env.FEEDBACK_REQUEST_WINDOW_SECONDS
            ) || 3600,

    };

    readonly rateLimit = {
        windowSeconds: Number(
            process.env.RATE_LIMIT_WINDOW_SECONDS ?? 60
        ),

        maxRequests: Number(
            process.env.RATE_LIMIT_MAX_REQUESTS ?? 50
        ),
    };

}


const env = new Env();

export default env;