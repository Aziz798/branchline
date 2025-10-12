import api from "@/api/axios";
import { PROJECTS_API } from "@/api/base-api-endpoints";
import { ModeToggle } from "@/components/theme/mode-togle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type {
  GetProjectsForUserResponse,
  ProjectStatus,
} from "@/types/project-types";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Plus, Settings, User } from "lucide-react";
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

export const Route = createLazyFileRoute("/_dashboard-layout")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const projects = useQuery<GetProjectsForUserResponse>({
    queryKey: ["projectsForUser"],
    queryFn: async () => {
      const response = await api.get(PROJECTS_API + "/projects/user");
      return response.data;
    },
  });

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Branchline</span>
              <span className="text-xs text-muted-foreground">Project Hub</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          <div className="px-2 py-2">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Projects
              </span>
              <Button size="icon" variant="ghost" className="h-6 w-6" asChild>
                <Link to="/dashboard">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">New Project</span>
                </Link>
              </Button>
            </div>

            <SidebarMenu>
              {projects.isLoading
                ? <div>Loading...</div>
                : projects.data?.projects &&
                  projects.data.projects.length > 0 &&
                  projects.data.projects.map((project) => {
                    const { variant, label } = getStatusBadge(project.status);
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
            </SidebarMenu>
          </div>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/dashboard">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/dashboard">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <div className="px-2 py-4">
              <ModeToggle />
            </div>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
