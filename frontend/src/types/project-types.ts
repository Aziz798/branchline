export type GetProjectsForUserResponse = {
    projects: {
        id: string;
        name: string;
        owner_id: string;
        status: ProjectStatus;
        description?: string;
        start_date?: Date;
        end_date?: Date;
        created_at: Date;
        updated_at: Date;
        number_of_pages: number;
    }[];
};
export type ProjectStatus =
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

export type CreateProjectRequestType = {
    name: string;
    description?: string;
    start_date?: Date;
    end_date?: Date;
};
