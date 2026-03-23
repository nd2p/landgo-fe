import axiosClient from "@/lib/axios";
import {
	getAccessToken,
} from "@/lib/auth-token";
import { getHomePathByRole } from "@/lib/auth-role";

const AUTH_ME_CACHE_TTL_MS = 5000;

let authMePromise: Promise<string | null> | null = null;
let lastResolvedRole: string | null = null;
let lastResolvedRoleAt = 0;

const getCurrentUserRole = async (
	options?: { force?: boolean; cacheTtlMs?: number }
): Promise<string | null> => {
	const force = options?.force ?? false;
	const cacheTtlMs = options?.cacheTtlMs ?? AUTH_ME_CACHE_TTL_MS;
	const now = Date.now();

	if (!force && now - lastResolvedRoleAt < cacheTtlMs) {
		return lastResolvedRole;
	}

	if (authMePromise) {
		return authMePromise;
	}

	authMePromise = (async () => {
		try {
			const response = await axiosClient.get<{ data?: { role?: string } }>("/auth/me");
			const role = response.data?.data?.role ?? null;
			lastResolvedRole = role;
			lastResolvedRoleAt = Date.now();
			return role;
		} catch {
			lastResolvedRole = null;
			lastResolvedRoleAt = Date.now();
			return null;
		} finally {
			authMePromise = null;
		}
	})();

	return authMePromise;
};

export const getAuthenticatedRedirectPath = async (): Promise<string | null> => {
	const accessToken = getAccessToken();

	if (!accessToken) {
		return null;
	}

	try {
		const role = await getCurrentUserRole();
		if (!role) {
			return null;
		}
		return getHomePathByRole(role ?? undefined);
	} catch {
		return null;
	}
};
