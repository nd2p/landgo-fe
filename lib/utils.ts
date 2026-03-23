import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RequestCacheEntry = {
  expiresAt: number;
  value: unknown;
  isError?: boolean;
};

type RequestCacheOptions = {
  successTtlMs: number;
  errorTtlMs?: number;
  cacheErrors?: boolean;
};

export const createRequestCache = (options: RequestCacheOptions) => {
  const inFlightRequests = new Map<string, Promise<unknown>>();
  const cache = new Map<string, RequestCacheEntry>();

  const run = <T>(key: string, requestFactory: () => Promise<T>): Promise<T> => {
    const now = Date.now();
    const cached = cache.get(key);

    if (cached && cached.expiresAt > now) {
      if (cached.isError) {
        return Promise.reject(cached.value);
      }
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
          expiresAt: Date.now() + options.successTtlMs,
          value: result,
        });
        return result;
      })
      .catch((error) => {
        if (options.cacheErrors) {
          cache.set(key, {
            expiresAt: Date.now() + (options.errorTtlMs ?? 0),
            value: error,
            isError: true,
          });
        }
        throw error;
      })
      .finally(() => {
        inFlightRequests.delete(key);
      });

    inFlightRequests.set(key, requestPromise as Promise<unknown>);
    return requestPromise;
  };

  const invalidateByPrefix = (prefixes: string[]) => {
    for (const key of cache.keys()) {
      if (prefixes.some((prefix) => key.startsWith(prefix))) {
        cache.delete(key);
      }
    }
  };

  const clear = () => {
    cache.clear();
    inFlightRequests.clear();
  };

  return {
    run,
    invalidateByPrefix,
    clear,
  };
};
