import env from "./env";

export const apiConfig = {
    baseURL: env.apiUrl,

    apiPrefix: "/api/v1",

    timeout: 40_000,

    withCredentials: true,
} as const;

export default apiConfig;