import { Navbar } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
    Cloud,
    Code2,
    GitBranch,
    MessageSquare,
    Shield,
    Users,
    Video,
    Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <section
                className="relative px-6 pt-32 pb-20 lg:px-8 lg:pt-40 lg:pb-28"
                id="hero"
            >
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="font-sans text-5xl font-bold leading-tight tracking-tight text-balance lg:text-7xl">
                        The complete platform for dev teams.
                    </h1>
                    <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty lg:text-xl">
                        Share code, collaborate in real-time, and manage cloud
                        resources across AWS, Azure, and GCP. Everything your
                        team needs to ship faster, all in one place.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button size="lg" asChild>
                            <Link to="/signup">Get Started Free</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link to="/">Watch Demo</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-y border-border/40 bg-card/50 px-6 py-12 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold lg:text-4xl">
                                10x
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                                Faster deployments
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold lg:text-4xl">
                                50%
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                                Less context switching
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold lg:text-4xl">
                                3+
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                                Cloud providers
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold lg:text-4xl">
                                24/7
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                                Team collaboration
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="px-6 py-20 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center">
                        <h2 className="font-sans text-3xl font-bold tracking-tight text-balance lg:text-5xl">
                            Everything you need to build together.
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground text-pretty">
                            Unified workspace for modern development teams.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="border-border/40 bg-card p-6 transition-colors hover:border-primary/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Code2 className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">
                                Code Sharing
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Share code snippets, review pull requests, and
                                collaborate on implementations in real-time with
                                syntax highlighting and version control.
                            </p>
                        </Card>

                        <Card className="border-border/40 bg-card p-6 transition-colors hover:border-primary/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <MessageSquare className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">
                                Team Chat
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Discuss code, share ideas, and make decisions
                                faster with threaded conversations and rich code
                                formatting.
                            </p>
                        </Card>

                        <Card className="border-border/40 bg-card p-6 transition-colors hover:border-primary/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Video className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">
                                Video Calls
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Jump on a call instantly with screen sharing and
                                collaborative debugging. No separate tools
                                needed.
                            </p>
                        </Card>

                        <Card className="border-border/40 bg-card p-6 transition-colors hover:border-primary/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Cloud className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">
                                Multi-Cloud Management
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Manage AWS, Azure, and GCP resources from one
                                dashboard. Monitor costs, deployments, and
                                infrastructure health.
                            </p>
                        </Card>

                        <Card className="border-border/40 bg-card p-6 transition-colors hover:border-primary/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <GitBranch className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">
                                Project Management
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Track issues, plan sprints, and manage releases
                                with integrated project boards and automated
                                workflows.
                            </p>
                        </Card>

                        <Card className="border-border/40 bg-card p-6 transition-colors hover:border-primary/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold">
                                Team Collaboration
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Invite unlimited team members, set permissions,
                                and collaborate seamlessly across time zones.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-y border-border/40 bg-card/50 px-6 py-20 lg:px-8 lg:py-28">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                        <Zap className="h-4 w-4" />
                        <span>Ship faster with Branchline</span>
                    </div>
                    <h2 className="mt-6 font-sans text-3xl font-bold tracking-tight text-balance lg:text-5xl">
                        Ready to transform your workflow?
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground text-pretty">
                        Join thousands of dev teams building better software
                        together.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button size="lg" asChild>
                            <Link to="/signup">Start Free Trial</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link to="/">Talk to Sales</Link>
                        </Button>
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>No credit card required • 14-day free trial</span>
                    </div>
                </div>
            </section>
        </>
    );
}
