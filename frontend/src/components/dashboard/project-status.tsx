import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/project-types";
import { Badge } from "../ui/badge";

export default function ProjectStatus(
    { projectStatus }: { projectStatus: ProjectStatus },
) {
    const statusColors: Record<ProjectStatus, string> = {
        not_started: "bg-gray-500",
        in_progress: "bg-blue-500",
        completed: "bg-green-500",
        on_hold: "bg-yellow-500",
        cancelled: "bg-red-500",
        blocked: "bg-purple-500",
        review: "bg-indigo-500",
        testing: "bg-teal-500",
        deployed: "bg-cyan-500",
        archived: "bg-muted text-muted-foreground",
    };
    return (
        <Badge
            className={cn(
                "px-2 py-1 text-sm font-medium",
                statusColors[projectStatus],
            )}
        >
            {projectStatus.replace(/_/g, " ").replace(/\b\w/g, (c) =>
                c.toUpperCase())}
        </Badge>
    );
}
