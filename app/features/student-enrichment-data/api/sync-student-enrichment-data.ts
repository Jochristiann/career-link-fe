import { api } from "~/lib/api-client";

export const syncStudentEnrichmentData = (): Promise<{ data: { id: string }; message: string }> => {
  return api.get("/admin/sync_enrichment_data");
};
