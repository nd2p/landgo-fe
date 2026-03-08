import axiosClient from "@/lib/axios";
import { MeSchemaFormValues } from "./auth.validation";

export const getMeApi = () => {
  return axiosClient.get<{ data: MeSchemaFormValues; success: boolean }>(
    "/auth/me",
  );
};
