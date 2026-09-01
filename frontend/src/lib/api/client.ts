import axios from "axios";

import apiConfig from "@/src/config/api.config";

export const apiClient = axios.create({
    baseURL: apiConfig.baseURL,

    withCredentials:
        apiConfig.withCredentials,

    headers: {
        "Content-Type": "application/json",
    },

    timeout: apiConfig.timeout,
});

export default apiClient;