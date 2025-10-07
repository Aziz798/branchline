import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "@/contexts/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ModeToggle } from "@/components/theme/mode-togle";
import { AuthProvider } from "@/contexts/auth-context";

const queryClient = new QueryClient();

const RootLayout = () => (
    <ThemeProvider defaultTheme="system" storageKey="theme">
        <QueryClientProvider client={queryClient}>
            <ModeToggle />
            <AuthProvider>
                <Outlet />
            </AuthProvider>
            <TanStackRouterDevtools initialIsOpen={false} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </ThemeProvider>
);

export const Route = createRootRoute({ component: RootLayout });
