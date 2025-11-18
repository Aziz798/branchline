import { KanbanBoard } from "@/components/project/tasks/kanban-board";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard-layout/project/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const containers = ["A", "B", "C"];
  // const [parent, setParent] = useState(null);
  // const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>;

  return <KanbanBoard />;
}
