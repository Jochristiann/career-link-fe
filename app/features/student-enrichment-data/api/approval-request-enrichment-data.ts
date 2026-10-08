import { z } from "zod";
import { api } from "~/lib/api-client";

export const approvalChangeDataRequestInputSchema = z.object({
    id: z.string().min(1, "Request is required"),
    status: z.string().min(1, "Status is required")
})

export type ApprovalChangeDataRequestInput = z.infer<typeof approvalChangeDataRequestInputSchema>;

export const approvalChangeDataRequest = ({
                                            data,
                                        }: {
    data: ApprovalChangeDataRequestInput;
}): Promise<{ data: { id: string }; message: string }> => {
    return api.post(`/user/change-data-request/approval/${data.id}/status/${data.status}`);
};