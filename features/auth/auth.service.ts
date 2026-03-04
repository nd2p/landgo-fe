import axiosClient from "@/lib/axios";
import { removeAccessToken, setAccessToken } from "@/lib/auth-token";
import { AxiosError } from "axios";
import type { AuthRole } from "@/lib/auth-role";

export type RegisterPayload = {
	phone: string;
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
	provinceCode: string;
	provinceName: string;
	districtCode: string;
	districtName: string;
	wardCode: string;
	wardName: string;
	addressDetail?: string;
};

export type LoginPayload = {
	phone: string;
	password: string;
};
type RegisterResponse = {
	success: boolean;
	message: string;
	data: {
		userId: string;
	};
};

export type LoginResponse = {
	success: boolean;
	message: string;
	data: {
		accessToken: string;
		user: {
			id: string;
			name: string;
			email: string | null;
			phone: string;
			role: AuthRole;
			avatar: string | null;
		};
	};
};
export const registerUser = async (
	payload: RegisterPayload
): Promise<RegisterResponse> => {
	try {
		const response = await axiosClient.post<RegisterResponse>("/auth/register", payload);

		if (!response.data?.success) {
			throw new Error(response.data?.message || "Đăng ký thất bại");
		}

		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError<{ message?: string }>;
		const backendMessage = axiosError.response?.data?.message;
		throw new Error(backendMessage || "Đăng ký thất bại");
	}
};

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
	try {
		const response = await axiosClient.post<LoginResponse>("/auth/login", payload);

		if (!response.data?.success) {
			throw new Error(response.data?.message || "Đăng nhập thất bại");
		}

		setAccessToken(response.data.data.accessToken);
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError<{ message?: string }>;
		const backendMessage = axiosError.response?.data?.message;
		throw new Error(backendMessage || "Đăng nhập thất bại");
	}
};

export const logoutUser = async (): Promise<void> => {
	try {
		const response = await axiosClient.post<{ success?: boolean; message?: string }>(
			"/auth/logout"
		);

		if (!response.data?.success) {
			throw new Error(response.data?.message || "Đăng xuất thất bại");
		}
	} catch (error) {
		const axiosError = error as AxiosError<{ message?: string }>;
		const backendMessage = axiosError.response?.data?.message;
		throw new Error(backendMessage || "Đăng xuất thất bại");
	} finally {
		removeAccessToken();
	}
};
