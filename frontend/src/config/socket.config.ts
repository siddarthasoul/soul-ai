import env from "./env";

export const socketConfig = {
    url: env.socketUrl,

    withCredentials: true,

    transports: [
        "polling",
        "websocket",
    ],

    autoConnect: false,

    timeout: 40_000,

    reconnection: true,

    reconnectionAttempts: 5,

    reconnectionDelay: 1_000,

    reconnectionDelayMax: 5_000,
};

export default socketConfig;