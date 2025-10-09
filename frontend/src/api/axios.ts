import axios, {
    AxiosError,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from "axios";
import { AUTH_API } from "./base-api-endpoints";

interface AuthResponse {
    access_token: string;
}

// We'll inject the token dynamically
let accessTokenGetter: (() => string | null) | null = null;

// Function that AuthContext will call to provide token getter
export const setAccessTokenGetter = (getter: () => string | null) => {
    accessTokenGetter = getter;
};

const api = axios.create({
    withCredentials: true, // important for refresh_token cookie
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor → attach access token from memory
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = accessTokenGetter ? accessTokenGetter() : null;
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

// Response interceptor → handle token refresh
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Ask backend for a new token (browser sends refresh_token cookie)
                const res = await axios.post<AuthResponse>(
                    `${AUTH_API}/users/refresh-token`,
                    {},
                    { withCredentials: true },
                );

                const { access_token } = res.data;
                api.defaults.headers["Authorization"] =
                    `Bearer ${access_token}`;
                originalRequest.headers["Authorization"] =
                    `Bearer ${access_token}`;

                // Retry the original request
                return api(originalRequest);
            } catch (refreshErr) {
                // Handle refresh failure (logout, redirect, etc.)
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
