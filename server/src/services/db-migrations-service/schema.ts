import {
    boolean,
    date,
    index,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
export const userRoles = pgEnum("user_roles", [
    "admin",
    "user",
]);
export const userLoginProviders = pgEnum("user_login_providers", [
    "google",
    "email",
    "github",
]);
export const projectStatuses = pgEnum("project_statuses", [
    "not_started",
    "in_progress",
    "completed",
    "on_hold",
    "cancelled",
]);
export const userRoleInProjects = pgEnum("user_role_in_projects", [
    "scrum_master",
    "developer",
    "qa",
    "stakeholder",
    "product_owner",
    "project_manager",
]);

export const taskStatuses = pgEnum("task_statuses", [
    "not_started",
    "in_progress",
    "completed",
    "on_hold",
    "cancelled",
    "blocked",
    "review",
    "testing",
    "deployed",
    "archived",
]);

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    first_name: varchar({ length: 255 }).notNull(),
    last_name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: userRoles("role").default("user").notNull(),
    password: varchar({ length: 255 }),
    is_active: boolean().default(false),
    is_premium: boolean().default(false),
    premium_start_date: date(),
    premium_end_date: date(),
    login_provider: userLoginProviders("login_provider").notNull(),
    otp_secret: varchar({ length: 150 }),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
    uniqueIndex("email").on(table.email),
]);

export const projectsTable = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    start_date: date().notNull(),
    end_date: date(),
    status: projectStatuses("status").default("not_started").notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
});

export const projectMembersTable = pgTable("project_members", {
    id: uuid("id").primaryKey(),
    user_id: uuid("user_id").notNull().references(() => usersTable.id),
    project_id: uuid("project_id").notNull().references(() => projectsTable.id),
    role: userRoleInProjects("role").notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
    uniqueIndex("user_project_unique").on(table.user_id, table.project_id),
    index("project_members_project_id_idx").on(table.project_id),
    index("project_members_user_id_idx").on(table.user_id),
    index("project_members_role_idx").on(table.role),
]);

export const tasksTable = pgTable("tasks", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    start_date: date().notNull(),
    end_date: date(),
    status: taskStatuses("status").default("not_started").notNull(),
    user_id: uuid("user_id").notNull().references(() => usersTable.id),
    project_id: uuid("project_id").notNull().references(() => projectsTable.id),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
    index("tasks_project_id_idx").on(table.project_id),
    index("tasks_user_id_idx").on(table.user_id),
    index("tasks_status_idx").on(table.status),
    index("tasks_start_date_idx").on(table.start_date),
    index("tasks_end_date_idx").on(table.end_date),
]);

export const messagesTable = pgTable("messages", {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text().notNull(),
    sender_id: uuid("sender_id").notNull().references(() => usersTable.id),
    project_id: uuid("project_id").notNull().references(() => projectsTable.id),
    task_id: uuid("task_id").references(() => tasksTable.id),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
    index("messages_project_id_idx").on(table.project_id),
    index("messages_sender_id_idx").on(table.sender_id),
    index("messages_task_id_idx").on(table.task_id),
    index("messages_created_at_idx").on(table.created_at),
    index("messages_updated_at_idx").on(table.updated_at),
]);
