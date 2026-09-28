import { api } from "~/lib/api-client"
import type { Enrollment } from "~/types/api"

export const deleteStudentEnrollment = (bootcamp_id: string, user_id: string): Promise<{ data: Enrollment[] }> => {
      return api.delete(`bootcamp/enrollment/${bootcamp_id}/student/${user_id}`)
}