import CreateProjectDrawer from "@/components/dashboard/projects/create-project-drawer";
import { ModeToggle } from "@/components/theme/mode-toggle";
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
import { PageTitleContext } from "@/contexts/dashboard-layout-title-context";
import { createLazyFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Settings, User } from "lucide-react";
import { useState } from "react";

export const Route = createLazyFileRoute("/_dashboard-layout")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const [title, setTitle] = useState("Dashboard");

  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                B
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Branchline</span>
                <span className="text-xs text-muted-foreground">
                  Project Hub
                </span>
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
                <CreateProjectDrawer />
              </div>

              <SidebarMenu>
                {
                  /* <Suspense fallback={<ProjectsSkeleton />}>
                  <SidebarMenuProjects />
                </Suspense> */
                }
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
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>
          </header>
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </PageTitleContext.Provider>
  );
}
