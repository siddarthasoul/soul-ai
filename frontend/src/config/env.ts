const getEnv = (
    key: string,
    fallback?: string
): string => {
    const value = process.env[key];

    if (value) {
        return value;
    }

    if (fallback !== undefined) {
        return fallback;
    }

    throw new Error(
        `Missing environment variable: ${key}`
    );
};

const env = {
    apiUrl: getEnv(
        "NEXT_PUBLIC_API_URL",

    ),

    socketUrl: getEnv(
        "NEXT_PUBLIC_SOCKET_URL",
    ),
} as const;

export default env;