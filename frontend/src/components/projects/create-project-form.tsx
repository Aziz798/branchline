import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CreateProjectRequestType } from "@/types/project-types";
import { useState } from "react";
import { Button } from "../ui/button";

export default function CreateProjectForm() {
    const [formData, setFormData] = useState<CreateProjectRequestType>({
        name: "",
        description: "",
        start_date: new Date(),
        end_date: new Date(),
    });
    return (
        <>
            <form className={cn("grid items-start gap-6")}>
                <Field className="grid gap-3">
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        type="email"
                        id="email"
                        defaultValue="shadcn@example.com"
                    />
                </Field>
                <Field className="grid gap-3">
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input id="username" defaultValue="@shadcn" />
                </Field>
                <Button type="submit">Save changes</Button>
            </form>
        </>
    );
}
