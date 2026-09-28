import { api } from "~/lib/api-client"
import {z} from "zod";

export const createStudentEnrollmentInputSchema = z.object({
    bootcamp_id: z.string().min(1, "Bootcamp is required"),
    user_id: z.array(z.string()).min(1, "Select at least one user")
});

export type CreateStudentEnrollmentInput = z.infer<typeof createStudentEnrollmentInputSchema>;
export const createStudentEnrollment = (
    {data}: {
    data: CreateStudentEnrollmentInput;
}): Promise<{ data: { id: string }; message: string }> => {

    return api.post(`bootcamp/enrollment/students`, data)
}