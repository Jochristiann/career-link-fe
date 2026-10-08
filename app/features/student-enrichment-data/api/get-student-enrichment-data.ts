import { api } from "~/lib/api-client";
import type { User } from "~/types/api";

export const getRequests = (
    page: number,
    size?: number,
    search?: string,
    status?: string,
    date?:string,
): Promise<{ data: User[]; meta: { last_page: number } }> => {

  const params = new URLSearchParams({ page: String(page) });

  if (size) params.set('per_page', String(size));
  if (search) params.set('search', search);
  if (status) params.set('approval_status', status);
  if (date) params.set('created_at', date);

  return api.get(`/user/paginate-request?${params.toString()}`);
};