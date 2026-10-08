import type {ChangeDataRequest} from "~/types/api";
import {api} from "~/lib/api-client";

export const getAllRequestsEnrichmentData = (): Promise<{ data: ChangeDataRequest[] }> => {
    return api.get(`user/request`)
}