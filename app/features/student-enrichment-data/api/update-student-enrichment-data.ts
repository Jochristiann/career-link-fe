import { z } from "zod";
import { api } from "~/lib/api-client";

export const updateStudentEnrichmentDataInputSchema = z.object({
    position: z.string().min(1, "Position is required"),
    company: z.string().min(1, "Company is required"),
})

export type UpdateStudentEnrichmentDataInput = z.infer<typeof updateStudentEnrichmentDataInputSchema>;

export const updateStudentEnrichmentData = ({
                                            data,id
                                        }: {
    data: UpdateStudentEnrichmentDataInput;
    id: string;
}): Promise<{ data: { id: string }; message: string }> => {
    return api.post(`/user/student-enrichment-data/update/${id}`, data);
};