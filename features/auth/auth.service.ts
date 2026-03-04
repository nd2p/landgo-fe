const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

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

type RegisterResponse = {
	success: boolean;
	message: string;
	data: {
		userId: string;
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
	});

	const data = (await response.json()) as
		| RegisterResponse
		| { success?: boolean; message?: string };

	if (!response.ok || !data.success) {
		throw new Error(data.message || "Đăng ký thất bại");
	}

	return data as RegisterResponse;
};
