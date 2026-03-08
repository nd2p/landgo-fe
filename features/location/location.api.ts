import axiosClient from "@/lib/axios";
import { IDistrict, IProvince, IWard, Paginated } from "./location.type";

export const getProvincesApi = (params?: Paginated) => {
  return axiosClient.get<{
    success: boolean;
    data: IProvince[];
  }>("/locations/provinces", {
    params,
  });
};

export const getDistrictsApi = (provinceId: string, params?: Paginated) => {
  return axiosClient.get<{ success: boolean; data: IDistrict[] }>(
    `/locations/provinces/${provinceId}/districts`,
    {
      params,
    },
  );
};

export const getWardsApi = (districsId: string, params?: Paginated) => {
  return axiosClient.get<{ success: boolean; data: IWard[] }>(
    `/locations/districts/${districsId}/wards`,
    {
      params,
    },
  );
};
