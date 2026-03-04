const ACCESS_TOKEN_KEY = "landgo_access_token";

const isBrowser = (): boolean => typeof window !== "undefined";

export const getAccessToken = (): string | null => {
	if (!isBrowser()) return null;
	return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string): void => {
	if (!isBrowser()) return;
	window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const removeAccessToken = (): void => {
	if (!isBrowser()) return;
	window.localStorage.removeItem(ACCESS_TOKEN_KEY);
};
