"use client";
import {
    closestCorners,
    DndContext,
    type DragEndEvent,
    DragOverlay,
    type DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";

export interface Task {
    id: string;
    title: string;
    description?: string;
}

export interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

const DEFAULT_COLUMNS: Column[] = [
    {
        id: "todo",
        title: "To Do",
        tasks: [
            {
                id: "1",
                title: "Design new landing page",
                description: "Create mockups and wireframes",
            },
            {
                id: "2",
                title: "Review pull requests",
                description: "Check team submissions",
            },
        ],
    },
    {
        id: "in-progress",
        title: "In Progress",
        tasks: [
            {
                id: "3",
                title: "Implement authentication",
                description: "Add OAuth integration",
            },
            {
                id: "4",
                title: "Database optimization",
                description: "Improve query performance",
            },
        ],
    },
    {
        id: "done",
        title: "Done",
        tasks: [
            {
                id: "5",
                title: "Setup CI/CD pipeline",
                description: "GitHub Actions workflow",
            },
            {
                id: "6",
                title: "Deploy to production",
                description: "Release v1.0",
            },
        ],
    },
];

export function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const taskId = active.id as string;

        // Find the task that's being dragged
        for (const column of columns) {
            const task = column.tasks.find((t) => t.id === taskId);
            if (task) {
                setActiveTask(task);
                break;
            }
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // Reset active task
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // If dropped on the same element, do nothing
        if (activeId === overId) return;

        // Find the source column and task
        let sourceColumnIndex = -1;
        let sourceTaskIndex = -1;
        let targetColumnId = "";

        // Find which column contains the dragged task
        for (let i = 0; i < columns.length; i++) {
            const taskIndex = columns[i].tasks.findIndex((task) =>
                task.id === activeId
            );
            if (taskIndex !== -1) {
                sourceColumnIndex = i;
                sourceTaskIndex = taskIndex;
                break;
            }
        }

        // Check if dropped on a column
        const droppedOnColumn = columns.some((column) => column.id === overId);
        if (droppedOnColumn) {
            targetColumnId = overId;
        } else {
            // Find which column contains the target task
            for (const column of columns) {
                if (column.tasks.some((task) => task.id === overId)) {
                    targetColumnId = column.id;
                    break;
                }
            }
        }

        // If we can't find the target column, do nothing
        if (!targetColumnId || sourceColumnIndex === -1) return;

        // Move the task to the target column
        setColumns((prevColumns) => {
            const newColumns = [...prevColumns];
            // Get the task from the source column
            const [movedTask] = newColumns[sourceColumnIndex].tasks.splice(
                sourceTaskIndex,
                1,
            );

            // Find the target column index
            const targetColumnIndex = newColumns.findIndex((col) =>
                col.id === targetColumnId
            );

            if (droppedOnColumn) {
                // If dropped directly on a column, append to the end
                newColumns[targetColumnIndex].tasks.push(movedTask);
            } else {
                // If dropped on a task, find its position
                const targetTaskIndex = newColumns[targetColumnIndex].tasks
                    .findIndex(
                        (task) => task.id === overId,
                    );

                // Insert after the task we dropped on
                newColumns[targetColumnIndex].tasks.splice(
                    targetTaskIndex + 1,
                    0,
                    movedTask,
                );
            }

            return newColumns;
        });
    };

    const handleAddTask = (columnId: string, title: string) => {
        setColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.id === columnId
                    ? {
                        ...col,
                        tasks: [
                            ...col.tasks,
                            {
                                id: Date.now().toString(),
                                title,
                                description: "",
                            },
                        ],
                    }
                    : col
            )
        );
    };

    const handleDeleteTask = (columnId: string, taskId: string) => {
        setColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.id === columnId
                    ? {
                        ...col,
                        tasks: col.tasks.filter((t) => t.id !== taskId),
                    }
                    : col
            )
        );
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="min-h-screen p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Task Board</h1>
                    <p className="text-muted-foreground">
                        Drag and drop tasks between columns to organize your
                        work
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map((column) => (
                        <KanbanColumn
                            key={column.id}
                            column={column}
                            onAddTask={handleAddTask}
                            onDeleteTask={handleDeleteTask}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask && (
                        <div className="w-full opacity-70">
                            <TaskCard
                                task={activeTask}
                                columnId=""
                                onDeleteTask={() => {}}
                            />
                        </div>
                    )}
                </DragOverlay>
            </div>
        </DndContext>
    );
}
