export const BASE_API = import.meta.env.MODE === "development"
    ? (import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:8080/")
    : "https://api.branchline.me/";

export const AUTH_API = `${BASE_API}auth-service/api/v1`;
export const PROJECTS_API = "http://localhost:8081/projects-service/api/v1";
