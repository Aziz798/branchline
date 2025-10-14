import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import api from "@/api/axios";
import { PROJECTS_API } from "@/api/base-api-endpoints";
import { cn } from "@/lib/utils";
import { validateCreateProjectForm } from "@/lib/validators/projects-validators";
import type { CreateProjectRequestType } from "@/types/project-types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Calendar28 } from "./date-picker";

export default function CreateProjectForm(
    { className }: { className?: string },
) {
    const [formData, setFormData] = useState<CreateProjectRequestType>({
        name: "",
        description: "",
    });
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const mutation = useMutation({
        mutationKey: ["create-project"],
        mutationFn: async (newProject: CreateProjectRequestType) => {
            const res = await api.post(
                `${PROJECTS_API}/projects/create`,
                newProject,
            );
            return res.data;
        },
        onSuccess: (data) => {
            console.log("Project created successfully:", data);
        },
        onError: (error) => {
            console.error("Error creating project:", error);
        },
    });
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const submitData = {
            ...formData,
            start_date: startDate,
            end_date: endDate,
        };
        console.log(submitData);

        const results = validateCreateProjectForm(submitData);
        mutation.mutate(submitData);
        console.log(results);
    }
    return (
        <>
            <div className={cn("w-full max-w-md", className)}>
                <form onSubmit={handleSubmit}>
                    {JSON.stringify(formData)}
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend>Create new project</FieldLegend>

                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="name">
                                        Name
                                    </FieldLabel>
                                    <Input
                                        id="name"
                                        placeholder="Project Name"
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <FieldSeparator />
                        <FieldSet>
                            <div className="grid grid-cols-2 gap-4">
                                <Calendar28
                                    formDate={startDate}
                                    setFormDate={setStartDate}
                                    label="Start Date"
                                />

                                <Calendar28
                                    formDate={endDate}
                                    setFormDate={setEndDate}
                                    label="End Date"
                                />
                            </div>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="description">
                                        Description
                                    </FieldLabel>
                                    <Textarea
                                        id="description"
                                        placeholder="Project Description"
                                        required
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="resize-none"
                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <Field orientation="horizontal">
                            <Button type="submit">Submit</Button>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </>
    );
}
