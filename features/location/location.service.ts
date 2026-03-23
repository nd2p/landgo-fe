import { getDistrictsApi, getProvincesApi, getWardsApi } from "./location.api";
import { IDistrict, IProvince, IWard, Paginated } from "./location.type";
import { paginationSchema } from "./location.validation";

const LOCATION_REQUEST_CACHE_TTL_MS = 2000;
const ERROR_CACHE_TTL_MS = 500; 

const inFlightRequests = new Map<string, Promise<unknown>>();
const cache = new Map<
  string,
  { expiresAt: number; value: unknown }
>();

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

const fetchWithCache = <T>(
  key: string,
  requestFactory: () => Promise<T>
): Promise<T> => {
  const now = Date.now();

  const cached = cache.get(key);
  if (cached && cached.expiresAt > now) {
    return Promise.resolve(cached.value as T);
  }

  if (cached) {
    cache.delete(key);
  }

  const inFlight = inFlightRequests.get(key);
  if (inFlight) {
    return inFlight as Promise<T>;
  }

  const requestPromise = requestFactory()
    .then((result) => {
      cache.set(key, {
        expiresAt: Date.now() + LOCATION_REQUEST_CACHE_TTL_MS,
        value: result,
      });

      setTimeout(() => {
        cache.delete(key);
      }, LOCATION_REQUEST_CACHE_TTL_MS);

      return result;
    })
    .catch((err) => {
      // optional: cache error (tránh spam API)
      cache.set(key, {
        expiresAt: Date.now() + ERROR_CACHE_TTL_MS,
        value: Promise.reject(err),
      });

      setTimeout(() => {
        cache.delete(key);
      }, ERROR_CACHE_TTL_MS);

      throw err;
    })
    .finally(() => {
      inFlightRequests.delete(key);
    });

  inFlightRequests.set(key, requestPromise);
  return requestPromise;
};

export const getProvinceService = async (params?: Paginated) => {
  try {
    const validated = await validatePagination(params);

    const key = buildRequestKey("provinces", validated);

    return fetchWithCache<IProvince[]>(key, async () => {
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

    return fetchWithCache<IDistrict[]>(key, async () => {
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

    return fetchWithCache<IWard[]>(key, async () => {
      const res = await getWardsApi(districtId, validated);
      return res.data.data;
    });
  } catch (error) {
    console.error("Get wards error:", error);
    throw error;
  }
};