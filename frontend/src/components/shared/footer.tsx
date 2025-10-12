import { ModeToggle } from "@/components/theme/mode-togle";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <span className="font-mono text-lg font-bold text-primary-foreground">
                                    B
                                </span>
                            </div>
                            <span className="font-sans text-xl font-semibold">
                                branchline
                            </span>
                        </Link>

                        <div className="hidden items-center gap-6 md:flex">
                            <Link
                                to="/"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Features
                            </Link>
                            <Link
                                to="/"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Pricing
                            </Link>
                            <Link
                                to="/"
                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Docs
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/login">Sign In</Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link to="/signup">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
