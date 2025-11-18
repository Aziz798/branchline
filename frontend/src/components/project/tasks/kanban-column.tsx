"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { Column } from "./kanban-board";
import { TaskCard } from "./task-card";

interface KanbanColumnProps {
    column: Column;
    onAddTask: (columnId: string, title: string) => void;
    onDeleteTask: (columnId: string, taskId: string) => void;
}

export function KanbanColumn(
    { column, onAddTask, onDeleteTask }: KanbanColumnProps,
) {
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: {
            type: "column",
            column,
        },
    });

    const handleAddTask = () => {
        if (newTaskTitle.trim()) {
            onAddTask(column.id, newTaskTitle);
            setNewTaskTitle("");
            setIsAddingTask(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div
                className={`bg-muted rounded-lg p-4 min-h-96 flex flex-col h-full ${
                    isOver ? "ring-2 ring-primary ring-inset bg-muted/80" : ""
                }`}
            >
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-1">
                        {column.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {column.tasks.length} tasks
                    </p>
                </div>

                <div
                    ref={setNodeRef}
                    className="flex-1 overflow-y-auto"
                >
                    <SortableContext
                        items={column.tasks.map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3 mb-4">
                            {column.tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    columnId={column.id}
                                    onDeleteTask={onDeleteTask}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </div>

                {isAddingTask
                    ? (
                        <div className="space-y-2 mt-auto">
                            <Input
                                placeholder="Enter task title..."
                                value={newTaskTitle}
                                onChange={(e) =>
                                    setNewTaskTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddTask();
                                    if (e.key === "Escape") {
                                        setIsAddingTask(false);
                                        setNewTaskTitle("");
                                    }
                                }}
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleAddTask}
                                    className="flex-1"
                                >
                                    Add
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setIsAddingTask(false);
                                        setNewTaskTitle("");
                                    }}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )
                    : (
                        <Button
                            variant="outline"
                            className="w-full bg-transparent mt-auto"
                            onClick={() => setIsAddingTask(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Task
                        </Button>
                    )}
            </div>
        </div>
    );
}
