import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useSetPageTitle } from "@/contexts/dashboard-layout-title-context";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Clock,
  Cloud,
  Code2,
  GitBranch,
  MessageSquare,
  Users,
  Video,
} from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_dashboard-layout/dashboard/")({
  component: DashboardPage,
});
const recentActivity = [
  {
    id: "1",
    type: "code",
    title: "Updated authentication module",
    description: "Modified JWT token validation in auth.ts",
    project: "E-commerce Platform",
    time: "2 hours ago",
    icon: Code2,
  },
  {
    id: "2",
    type: "chat",
    title: "New message in #backend-team",
    description: "Sarah: Can we review the API endpoints?",
    project: "Mobile App Backend",
    time: "4 hours ago",
    icon: MessageSquare,
  },
  {
    id: "3",
    type: "video",
    title: "Team standup completed",
    description: "Daily sync with the development team",
    project: "Analytics Dashboard",
    time: "Yesterday",
    icon: Video,
  },
  {
    id: "4",
    type: "cloud",
    title: "AWS deployment successful",
    description: "Production environment updated to v2.1.0",
    project: "Payment Gateway",
    time: "2 days ago",
    icon: Cloud,
  },
];

// Mock stats
const stats = [
  {
    label: "Active Projects",
    value: "5",
    icon: GitBranch,
    change: "+2 this month",
  },
  { label: "Team Members", value: "12", icon: Users, change: "+3 this week" },
  {
    label: "Cloud Resources",
    value: "24",
    icon: Cloud,
    change: "Across 3 providers",
  },
  { label: "Active Calls", value: "2", icon: Video, change: "In progress now" },
];

function DashboardPage() {
  const setTitle = useSetPageTitle();

  useEffect(() => {
    setTitle("Dashboard");
    return () => setTitle("Dashboard");
  }, [setTitle]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className="text-xs text-muted-foreground">
                  {stat.change}
                </span>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            className="justify-start bg-transparent"
            asChild
          >
            <Link to="/dashboard">
              <Code2 className="mr-2 h-4 w-4" />
              Share Code
            </Link>
          </Button>
          <Button
            variant="outline"
            className="justify-start bg-transparent"
            asChild
          >
            <Link to="/dashboard">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Chat
            </Link>
          </Button>
          <Button
            variant="outline"
            className="justify-start bg-transparent"
            asChild
          >
            <Link to="/dashboard">
              <Video className="mr-2 h-4 w-4" />
              Video Call
            </Link>
          </Button>
          <Button
            variant="outline"
            className="justify-start bg-transparent"
            asChild
          >
            <Link to="/dashboard">
              <Cloud className="mr-2 h-4 w-4" />
              Manage Cloud
            </Link>
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">View All</Link>
          </Button>
        </div>

        <ItemGroup>
          {recentActivity.map((activity, index) => (
            <div key={activity.id}>
              <Item variant="default" asChild>
                <Link to={`/dashboard`}>
                  <ItemMedia variant="icon">
                    <activity.icon className="h-4 w-4" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{activity.title}</ItemTitle>
                    <ItemDescription>
                      {activity.description}
                    </ItemDescription>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{activity.project}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </span>
                    </div>
                  </ItemContent>
                </Link>
              </Item>
              {index < recentActivity.length - 1 && (
                <div className="h-px bg-border my-2" />
              )}
            </div>
          ))}
        </ItemGroup>
      </Card>

      {/* Empty State Example (commented out, shown when no activity) */}
      {
        /* <Card className="p-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Activity />
            </EmptyMedia>
            <EmptyTitle>No recent activity</EmptyTitle>
            <EmptyDescription>
              Get started by creating a new project or joining an existing one.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link to="/dashboard/projects/new">Create Project</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </Card> */
      }
    </div>
  );
}
