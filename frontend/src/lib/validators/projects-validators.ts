import type { CreateProjectRequestType } from "@/types/project-types";
import z from "zod";

export function validateCreateProjectForm(form: CreateProjectRequestType) {
    const schema = z.object({
        name: z.string().min(2, "Project name is too short"),
        description: z.string().min(5, "Description is too short"),
        start_date: z.date(),
        end_date: z.date(),
    })
        .superRefine((data, ctx) => {
            if (data.end_date < data.start_date) {
                ctx.addIssue({
                    code: "custom",
                    message: "End date cannot be before start date",
                    path: ["end_date"],
                });
            }
        });
    const result = schema.safeParse(form);
    if (!result.success) {
        const errors = z.treeifyError(result.error).properties;
        return { success: false, errors };
    }
    return { success: true };
}
