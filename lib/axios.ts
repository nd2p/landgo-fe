import axios from "axios";

import {
	getAccessToken,
	removeAccessToken,
	setAccessToken,
} from "@/lib/auth-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9999/api/v1";

const AUTH_REFRESH_CACHE_TTL_MS = 5000;

let refreshTokenPromise: Promise<string | null> | null = null;
let lastRefreshTokenValue: string | null = null;
let lastRefreshTokenAt = 0;

const axiosClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000,
	withCredentials: true,
});

export const refreshAccessToken = async (
	options?: { force?: boolean; cacheTtlMs?: number }
): Promise<string | null> => {
	const force = options?.force ?? false;
	const cacheTtlMs = options?.cacheTtlMs ?? AUTH_REFRESH_CACHE_TTL_MS;
	const now = Date.now();

	if (!force && now - lastRefreshTokenAt < cacheTtlMs) {
		return lastRefreshTokenValue;
	}

	if (refreshTokenPromise) {
		return refreshTokenPromise;
	}

	refreshTokenPromise = (async () => {
		try {
			const refreshResponse = await axiosClient.post("/auth/refresh-token");
			const newAccessToken = refreshResponse.data?.data?.accessToken as string | undefined;

			if (!newAccessToken) {
				removeAccessToken();
				lastRefreshTokenValue = null;
				lastRefreshTokenAt = Date.now();
				return null;
			}

			setAccessToken(newAccessToken);
			lastRefreshTokenValue = newAccessToken;
			lastRefreshTokenAt = Date.now();
			return newAccessToken;
		} catch {
			removeAccessToken();
			lastRefreshTokenValue = null;
			lastRefreshTokenAt = Date.now();
			return null;
		} finally {
			refreshTokenPromise = null;
		}
	})();

	return refreshTokenPromise;
};

axiosClient.interceptors.request.use((config) => {
	const token = getAccessToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

axiosClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config as {
			_retry?: boolean;
			headers: Record<string, string>;
			url?: string;
		};

		if (
			error.response?.status === 401 &&
			!originalRequest?._retry &&
			!originalRequest?.url?.includes("/auth/login") &&
			!originalRequest?.url?.includes("/auth/refresh-token")
		) {
			originalRequest._retry = true;

			try {
				const newAccessToken = await refreshAccessToken({
					force: true,
					cacheTtlMs: 0,
				});

				if (!newAccessToken) {
					throw new Error("No access token returned");
				}

				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				return axiosClient(originalRequest);
			} catch (refreshError) {
				removeAccessToken();
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default axiosClient;
