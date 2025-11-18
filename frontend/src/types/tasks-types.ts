export type Task = {
    id: string;
    title: string;
    description?: string;
    start_date: Date;
    end_date?: Date;
    status:
        | "not_started"
        | "in_progress"
        | "completed"
        | "on_hold"
        | "cancelled"
        | "blocked"
        | "review"
        | "testing"
        | "deployed"
        | "archived";
    user_id: string;
    project_id: string;
    created_at: Date;
    updated_at: Date;
};
