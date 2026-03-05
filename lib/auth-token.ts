// Token handling
const ACCESS_TOKEN_KEY = "landgo_access_token";
const AUTH_TOKEN_CHANGED_EVENT = "landgo-auth-token-changed";
const EXPIRY_BUFFER_MS = 60 * 1000;

const isBrowser = (): boolean => typeof window !== "undefined";

const normalizeToken = (token: string | null): string | null => {
	if (!token) return null;
	const trimmed = token.trim();
	if (!trimmed || trimmed === "undefined" || trimmed === "null") return null;
	return trimmed;
};

const emitAuthTokenChanged = (): void => {
	if (!isBrowser()) return;
	window.dispatchEvent(new Event(AUTH_TOKEN_CHANGED_EVENT));
};

export const getAccessToken = (): string | null => {
	if (!isBrowser()) return null;
	return normalizeToken(window.localStorage.getItem(ACCESS_TOKEN_KEY));
};

export const isLoggedIn = (): boolean => Boolean(getAccessToken());

export const isAccessTokenExpired = (token: string | null): boolean => {
	const normalized = normalizeToken(token);
	if (!normalized) return true;

	try {
		const base64Payload = normalized.split(".")[1];
		if (!base64Payload) return true;

		const base64 = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
		const payloadJson = atob(base64);
		const payload = JSON.parse(payloadJson) as { exp?: number };

		if (!payload.exp) return true;

		const expirationTime = payload.exp * 1000;
		return Date.now() >= expirationTime - EXPIRY_BUFFER_MS;
	} catch {
		return true;
	}
};

export const authTokenChangedEventName = AUTH_TOKEN_CHANGED_EVENT;

export const setAccessToken = (token: string): void => {
	if (!isBrowser()) return;
	const normalized = normalizeToken(token);
	if (!normalized) {
		window.localStorage.removeItem(ACCESS_TOKEN_KEY);
	} else {
		window.localStorage.setItem(ACCESS_TOKEN_KEY, normalized);
	}
	emitAuthTokenChanged();
};

export const removeAccessToken = (): void => {
	if (!isBrowser()) return;
	window.localStorage.removeItem(ACCESS_TOKEN_KEY);
	emitAuthTokenChanged();
};