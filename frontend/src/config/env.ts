const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

if (!apiUrl) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_API_URL");
}

if (!socketUrl) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SOCKET_URL");
}

const env = {
    apiUrl,
    socketUrl,
} as const;

export default env;