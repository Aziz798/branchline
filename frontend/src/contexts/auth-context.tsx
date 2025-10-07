// src/contexts/auth-context.tsx
import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import api from "@/api/axios";

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

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await api.post("/refresh");
                setAccessToken(res.data.accessToken);
            } catch {
                console.warn("No valid session found");
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const logout = async () => {
        await api.post("/logout");
        setAccessToken(null);
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
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
