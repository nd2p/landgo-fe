import axiosClient from "@/lib/axios";
import {
	getAccessToken,
	isAccessTokenExpired,
	removeAccessToken,
	setAccessToken,
} from "@/lib/auth-token";
import { getHomePathByRole } from "@/lib/auth-role";

export const refreshAccessTokenIfNeeded = async (): Promise<boolean> => {
	const accessToken = getAccessToken();

	if (accessToken && !isAccessTokenExpired(accessToken)) {
		return true;
	}

	try {
		const response = await axiosClient.post<{ data?: { accessToken?: string } }>(
			"/auth/refresh-token"
		);

		const newAccessToken = response.data?.data?.accessToken;
		if (!newAccessToken) {
			removeAccessToken();
			return false;
		}

		setAccessToken(newAccessToken);
		return true;
	} catch {
		removeAccessToken();
		return false;
	}
};

export const getAuthenticatedRedirectPath = async (): Promise<string | null> => {
	const isAuthenticated = await refreshAccessTokenIfNeeded();

	if (!isAuthenticated) {
		return null;
	}

	try {
		const response = await axiosClient.get<{ data?: { role?: string } }>("/auth/me");
		return getHomePathByRole(response.data?.data?.role);
	} catch {
		return "/";
	}
};
