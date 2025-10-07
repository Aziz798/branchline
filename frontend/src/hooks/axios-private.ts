// src/context/useAxiosPrivate.ts
import { useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "@/contexts/auth-context";

export const useAxiosPrivate = () => {
    const { accessToken, setAccessToken, logout } = useAuth();

    useEffect(() => {
        const reqInterceptor = api.interceptors.request.use(
            (config) => {
                if (accessToken && config.headers) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        const resInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest._retry) {
                    prevRequest._retry = true;
                    try {
                        const res = await api.post("/refresh");
                        setAccessToken(res.data.accessToken);
                        prevRequest.headers.Authorization =
                            `Bearer ${res.data.accessToken}`;
                        return api(prevRequest);
                    } catch (err) {
                        logout();
                    }
                }
                return Promise.reject(error);
            },
        );

        return () => {
            api.interceptors.request.eject(reqInterceptor);
            api.interceptors.response.eject(resInterceptor);
        };
    }, [accessToken, setAccessToken, logout]);

    return api;
};
