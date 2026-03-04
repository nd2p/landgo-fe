const ACCESS_TOKEN_KEY = "landgo_access_token";
const AUTH_TOKEN_CHANGED_EVENT = "landgo-auth-token-changed";

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
