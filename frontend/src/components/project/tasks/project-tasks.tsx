import api from "@/api/axios";
import { PROJECTS_API } from "@/api/base-api-endpoints";
import type { typeGetProjectWithTasksByIdResponse } from "@/types/project-types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

export default function ProjectTasks() {
    const { id } = useParams({ from: "/_dashboard-layout/project/$id/" });
    const project = useSuspenseQuery<typeGetProjectWithTasksByIdResponse>({
        queryKey: ["projectWithTasks", id],
        queryFn: async () => {
            const res = await api.get(`${PROJECTS_API}/projects/${id}`);
            console.log(res.data);

            return res.data;
        },
    });
    return (
        <>
            {JSON.stringify(project.data)}
        </>
    );
}
