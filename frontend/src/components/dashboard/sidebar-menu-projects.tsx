import api from "@/api/axios";
import { PROJECTS_API } from "@/api/base-api-endpoints";
import { Badge } from "@/components/ui/badge";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type {
    GetProjectsForUserResponse,
    ProjectStatus,
} from "@/types/project-types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "lucide-react";

function getStatusBadge(status: ProjectStatus) {
    const statusMap: Record<
        ProjectStatus,
        {
            variant: "default" | "secondary" | "destructive" | "outline";
            label: string;
        }
    > = {
        not_started: { variant: "secondary", label: "Not Started" },
        in_progress: { variant: "default", label: "In Progress" },
        completed: { variant: "outline", label: "Completed" },
        on_hold: { variant: "secondary", label: "On Hold" },
        cancelled: { variant: "destructive", label: "Cancelled" },
        blocked: { variant: "destructive", label: "Blocked" },
        review: { variant: "outline", label: "Review" },
        testing: { variant: "outline", label: "Testing" },
        deployed: { variant: "default", label: "Deployed" },
        archived: { variant: "secondary", label: "Archived" },
    };
    return statusMap[status];
}

export default function SidebarMenuProjects() {
    const projects = useSuspenseQuery<GetProjectsForUserResponse>({
        queryKey: ["projectsForUser"],
        queryFn: async () => {
            const response = await api.get(PROJECTS_API + "/projects/user");
            return response.data;
        },
    });
    return (
        <>
            {projects.data?.projects &&
                projects.data.projects.length > 0 &&
                projects.data.projects.map((project) => {
                    const { variant, label } = getStatusBadge(
                        project.status,
                    );
                    return (
                        <SidebarMenuItem key={project.id}>
                            <SidebarMenuButton asChild>
                                <Link to={`/dashboard`}>
                                    <Badge
                                        variant={variant}
                                        className="h-5 px-1.5 text-[10px] font-medium"
                                    >
                                        {label}
                                    </Badge>
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <span className="flex-1 truncate cursor-pointer">
                                                {project.name}
                                            </span>
                                        </HoverCardTrigger>
                                        <HoverCardContent
                                            side="right"
                                            align="start"
                                            className="w-80"
                                        >
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-semibold">
                                                    {project.name}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {project.description}
                                                </p>
                                                <div className="flex items-center gap-2 pt-2">
                                                    <Badge
                                                        variant={variant}
                                                        className="text-[10px]"
                                                    >
                                                        {label}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
        </>
    );
}
