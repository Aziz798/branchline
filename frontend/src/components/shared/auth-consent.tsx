import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function CookieConsent() {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => setShowConsent(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setShowConsent(false);
    };

    const declineCookies = () => {
        localStorage.setItem("cookie-consent", "declined");
        setShowConsent(false);
    };

    if (!showConsent) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
            <Card className="mx-auto max-w-5xl border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:p-6">
                    <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-base md:text-lg">
                            Cookie Preferences
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We use cookies to enhance your browsing experience,
                            analyze site traffic, and personalize content. By
                            clicking "Accept", you consent to our use of
                            cookies.{" "}
                            <a
                                href="/privacy"
                                className="underline underline-offset-4 hover:text-foreground transition-colors"
                            >
                                Learn more
                            </a>
                        </p>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <Button
                            variant="outline"
                            onClick={declineCookies}
                            className="flex-1 md:flex-none bg-transparent"
                        >
                            Decline
                        </Button>
                        <Button
                            onClick={acceptCookies}
                            className="flex-1 md:flex-none"
                        >
                            Accept
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={declineCookies}
                            className="hidden md:inline-flex"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
