import { createFileRoute } from "@tanstack/solid-router";
import { ModeToggle } from "~/components/theme/mode-toggle";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div class="min-h-screen bg-background text-foreground">
      <div class="p-4">
        <ModeToggle />
      </div>
      <div class="w-full h-96 flex items-center justify-center bg-card border border-border rounded-lg mx-4">
        <p class="text-card-foreground">
          This should change color with theme toggle!
        </p>
        <div class="ml-4 p-2 bg-secondary text-secondary-foreground rounded">
          Secondary colors test
        </div>
      </div>
    </div>
  );
}
