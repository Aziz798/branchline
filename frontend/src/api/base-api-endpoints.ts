export const BASE_API = import.meta.env.MODE === "development"
    ? (import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:8080/")
    : "https://api.branchline.me/";

export const AUTH_API = `${BASE_API}auth-service/api/v1`;
