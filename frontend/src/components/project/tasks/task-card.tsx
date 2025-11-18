"use client";

import { Card } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import type { Task } from "./kanban-board";

interface TaskCardProps {
    task: Task;
    columnId: string;
    onDeleteTask: (columnId: string, taskId: string) => void;
}

export function TaskCard({ task, columnId, onDeleteTask }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "task",
            task,
            columnId,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium break-words">
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="text-xs text-muted-foreground mt-1 break-words">
                            {task.description}
                        </p>
                    )}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(columnId, task.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
            </div>
        </Card>
    );
}
