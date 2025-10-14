import { Skeleton } from "@/components/ui/skeleton";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export default function ProjectsSkeleton() {
    return (
        <>
            {Array.from({ length: 5 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                    <SidebarMenuButton>
                        <Skeleton className="h-5 w-16 bg-sidebar-accent" />
                        <Skeleton className="h-4 flex-1 bg-sidebar-accent" />
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </>
    );
}
