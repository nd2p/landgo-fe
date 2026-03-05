// API client
import axios from "axios";

import {
	getAccessToken,
	removeAccessToken,
	setAccessToken,
} from "@/lib/auth-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9999/api/v1";

const axiosClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000,
	withCredentials: true,
});

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
				const refreshResponse = await axiosClient.post("/auth/refresh-token");
				const newAccessToken = refreshResponse.data?.data?.accessToken as string;

				if (!newAccessToken) {
					throw new Error("No access token returned");
				}

				setAccessToken(newAccessToken);
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