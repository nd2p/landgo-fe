import axiosClient from "@/lib/axios";
import { setAccessToken } from "@/lib/auth-token";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9999/api/v1";

export type RegisterPayload = {
	phone: string;
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

type LoginResponse = {
	success: boolean;
	message: string;
	data: {
		accessToken: string;
		user: {
			id: string;
			name: string;
			email: string;
			phone: string;
			role: string;
			avatar: string | null;
		};
	};
};

export const registerUser = async (
	payload: RegisterPayload
): Promise<RegisterResponse> => {
	const response = await fetch(`${API_BASE_URL}/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
		credentials: "include",
	});

	const data = (await response.json()) as
		| RegisterResponse
		| { success?: boolean; message?: string };

	if (!response.ok || !data.success) {
		throw new Error(data.message || "Đăng ký thất bại");
	}

	return data as RegisterResponse;
};

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
	const response = await axiosClient.post<LoginResponse>("/auth/login", payload);
    console.log("Login response:", response.data);
	if (!response.data?.success) {
		throw new Error(response.data?.message || "Đăng nhập thất bại");
	}

	setAccessToken(response.data.data.accessToken);
	return response.data;
};
