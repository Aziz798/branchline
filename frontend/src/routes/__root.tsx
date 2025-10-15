import { CookieConsent } from "@/components/shared/auth-consent";
import { Footer } from "@/components/shared/footer";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const queryClient = new QueryClient();

const RootLayout = () => (
    <ThemeProvider defaultTheme="system" storageKey="theme">
        <QueryClientProvider client={queryClient}>
            <ModeToggle />
            <AuthProvider>
                <div className="min-h-screen">
                    <Outlet />
                    <Footer />
                    <CookieConsent />
                </div>
            </AuthProvider>
            <TanStackRouterDevtools
                initialIsOpen={false}
                position="top-right"
            />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </ThemeProvider>
);

export const Route = createRootRoute({ component: RootLayout });
