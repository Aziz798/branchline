import { CookieConsent } from "@/components/shared/auth-consent";
import { Navbar } from "@/components/shared/footer";
import { Footer } from "@/components/shared/navbar";
import { ModeToggle } from "@/components/theme/mode-togle";
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
                    <Navbar />
                    <Outlet />
                    <Footer />
                    <CookieConsent />
                </div>
            </AuthProvider>
            <TanStackRouterDevtools initialIsOpen={false} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </ThemeProvider>
);

export const Route = createRootRoute({ component: RootLayout });
