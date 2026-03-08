import { getDistrictsApi, getProvincesApi, getWardsApi } from "./location.api";
import { Paginated } from "./location.type";
import { paginationSchema } from "./location.validation";

export const getProvinceService = async (params?: Paginated) => {
  try {
    const validated = await paginationSchema.validate(params, {
      abortEarly: false,
      stripUnknown: true,
    });

    const response = await getProvincesApi(validated);

    return response.data.data;
  } catch (error) {
    console.error("Get provinces error:", error);
    throw error;
  }
};

export const getDistrictsService = async (
  provinceId: string,
  params?: Paginated,
) => {
  try {
    const validated = await paginationSchema.validate(params, {
      abortEarly: false,
      stripUnknown: true,
    });

    const response = await getDistrictsApi(provinceId, validated);
    return response.data.data;
  } catch (error) {
    console.error("Get districs error:", error);
    throw error;
  }
};

export const getWardsService = async (
  districsId: string,
  params?: Paginated,
) => {
  try {
    const validated = await paginationSchema.validate(params, {
      abortEarly: false,
      stripUnknown: true,
    });

    const response = await getWardsApi(districsId, validated);
    return response.data.data;
  } catch (error) {
    console.error("Get districs error:", error);
    throw error;
  }
};
