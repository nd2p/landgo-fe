import { getDistrictsApi, getProvincesApi, getWardsApi } from "./location.api";
import { IDistrict, IProvince, IWard, Paginated } from "./location.type";
import { paginationSchema } from "./location.validation";
import { createRequestCache } from "@/lib/utils";

const LOCATION_REQUEST_CACHE_TTL_MS = 2000;
const ERROR_CACHE_TTL_MS = 500;

const locationRequestCache = createRequestCache({
  successTtlMs: LOCATION_REQUEST_CACHE_TTL_MS,
  errorTtlMs: ERROR_CACHE_TTL_MS,
  cacheErrors: true,
});

const normalizeValue = (val: unknown) => String(val ?? "");

const buildRequestKey = (scope: string, params?: Paginated) => {
  const searchParams = new URLSearchParams();

  if (typeof params?.page === "number") {
    searchParams.set("page", String(params.page));
  }

  if (typeof params?.limit === "number") {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  return query ? `${scope}?${query}` : scope;
};

const validatePagination = (params?: Paginated) =>
  paginationSchema.validate(params, {
    abortEarly: false,
    stripUnknown: true,
  });

export const getProvinceService = async (params?: Paginated) => {
  try {
    const validated = await validatePagination(params);

    const key = buildRequestKey("provinces", validated);

    return locationRequestCache.run<IProvince[]>(key, async () => {
      const res = await getProvincesApi(validated);
      return res.data.data;
    });
  } catch (error) {
    console.error("Get provinces error:", error);
    throw error;
  }
};

export const getDistrictsService = async (
  provinceId: string,
  params?: Paginated
) => {
  try {
    const validated = await validatePagination(params);

    const key = buildRequestKey(
      `districts:${normalizeValue(provinceId)}`,
      validated
    );

    return locationRequestCache.run<IDistrict[]>(key, async () => {
      const res = await getDistrictsApi(provinceId, validated);
      return res.data.data;
    });
  } catch (error) {
    console.error("Get districts error:", error);
    throw error;
  }
};

export const getWardsService = async (
  districtId: string,
  params?: Paginated
) => {
  try {
    const validated = await validatePagination(params);

    const key = buildRequestKey(
      `wards:${normalizeValue(districtId)}`,
      validated
    );

    return locationRequestCache.run<IWard[]>(key, async () => {
      const res = await getWardsApi(districtId, validated);
      return res.data.data;
    });
  } catch (error) {
    console.error("Get wards error:", error);
    throw error;
  }
};