export type AuthRole = "user" | "moderator";

export const getHomePathByRole = (role: string | null | undefined): string => {
	if (role === "moderator") {
		return "/admin/dashboard";
	}

	return "/";
};

export const isModeratorPath = (path: string | null | undefined): boolean => {
	if (!path) return false;
	return path.startsWith("/admin");
};