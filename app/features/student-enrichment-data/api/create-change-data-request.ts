import { z } from "zod";
import { api } from "~/lib/api-client";

export const createChangeDataRequestInputSchema = z.object({
    user_id: z.string().min(1, "User is required"),
    new_position: z.string().min(1, "New position is required"),
    new_company: z.string().min(1, "New company is required"),
    enrichment_batch: z.string()
        .refine((val) => {
            const number = parseInt(val, 10)
            return !Number.isNaN(number) && number >= 1
        }, {
            message: "Enrichment batch must be a number greater than or equal to 1"
        }),
    application_type: z.string().min(1, "Application type is required"),
})

export type CreateChangeDataRequestInput = z.infer<typeof createChangeDataRequestInputSchema>;

export const createChangeDataRequest = ({
                                      data,
                                  }: {
    data: CreateChangeDataRequestInput;
}): Promise<{ data: { id: string }; message: string }> => {
    return api.post("/user/change-data-request/create", data);
};