import type {ChangeDataRequest, StudentEnrichmentData} from "~/types/api";
import {api} from "~/lib/api-client";

export const getStudentRequestsEnrichmentDataByUserAndBatch = (user_id:string,batch:number): Promise<{ data: StudentEnrichmentData }> => {
    return api.get(`user/student-enrichment-data/get/${user_id}/batch/${batch}`)
}