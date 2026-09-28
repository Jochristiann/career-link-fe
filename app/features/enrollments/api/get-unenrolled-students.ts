import { api } from "~/lib/api-client";
import type { User } from "~/types/api";

export const getUnenrolledUsers = (
    bootcamp_id:string
): Promise<{ data: User[] }> => {
  return api.get(`/user/enrollment/${bootcamp_id}`);
};