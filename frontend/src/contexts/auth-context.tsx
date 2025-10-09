import api, { setAccessTokenGetter } from "@/api/axios";
import { AUTH_API } from "@/api/base-api-endpoints";
import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type AuthContextType = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    logout: () => Promise<void>;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = (
    { children },
) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Register a getter so Axios can read the current token
    useEffect(() => {
        setAccessTokenGetter(() => accessToken);
    }, [accessToken]);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await api.post(AUTH_API + "/users/refresh-token"); // refresh cookie → new token
                setAccessToken(res.data.access_token);
                console.log("Session restored");
            } catch {
                console.warn("No valid session found");
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const logout = async () => {
        try {
            await api.post("/auth/users/logout");
        } catch {
            // ignore
        } finally {
            setAccessToken(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{ accessToken, setAccessToken, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
};
