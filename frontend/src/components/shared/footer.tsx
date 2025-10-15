import { Link } from "@tanstack/react-router";

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-card">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Product</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Integrations
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Changelog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">
                            Resources
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    API Reference
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Guides
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Legal</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Terms
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Security
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-border/40 pt-8">
                    <p className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()}{" "}
                        Branchline. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
