import axiosClient from "@/lib/axios";
import { removeAccessToken, setAccessToken } from "@/lib/auth-token";
import { createRequestCache } from "@/lib/utils";
import { AxiosError } from "axios";
import type { AuthRole } from "@/lib/auth-role";
import { getMeApi } from "./auth.api";
import { getAuthErrorMessage, getAuthSuccessMessage } from "./auth-errors";

const AUTH_REQUEST_CACHE_TTL_MS = 1500;

const authRequestCache = createRequestCache({
  successTtlMs: AUTH_REQUEST_CACHE_TTL_MS,
});

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

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordWithOtpPayload = {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
};

export type VerifyEmailOtpPayload = {
  email: string;
  otp: string;
};

type RegisterResponse = {
  success: boolean;
  message: string;
  data: {
    userId: string;
    emailOtpExpiresInSeconds?: number;
  };
};

type BasicAuthResponse = {
  success: boolean;
  message: string;
  data?: {
    expiresInSeconds?: number;
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
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const errorCode = axiosError.response?.data?.code;
    const backendMessage = axiosError.response?.data?.message;
    const translatedMessage = getAuthErrorMessage(errorCode, backendMessage);
    throw new Error(translatedMessage);
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
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const errorCode = axiosError.response?.data?.code;
    const backendMessage = axiosError.response?.data?.message;
    const translatedMessage = getAuthErrorMessage(errorCode, backendMessage);
    throw new Error(translatedMessage);
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
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const errorCode = axiosError.response?.data?.code;
    const backendMessage = axiosError.response?.data?.message;
    const translatedMessage = getAuthErrorMessage(errorCode, backendMessage);
    throw new Error(translatedMessage);
  } finally {
    removeAccessToken();
  }
};

export const requestPasswordResetOtp = async (
	payload: ForgotPasswordPayload
): Promise<BasicAuthResponse> => {
  try {
    const response = await axiosClient.post<BasicAuthResponse>(
      "/auth/forgot-password",
			payload
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Gửi mã OTP thất bại");
    }

    // Translate success message to Vietnamese
    return {
      ...response.data,
      message: getAuthSuccessMessage(response.data.message),
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const errorCode = axiosError.response?.data?.code;
    const backendMessage = axiosError.response?.data?.message;
    const translatedMessage = getAuthErrorMessage(errorCode, backendMessage);
    throw new Error(translatedMessage);
  }
};

export const resetPasswordWithOtp = async (
	payload: ResetPasswordWithOtpPayload
): Promise<BasicAuthResponse> => {
  try {
    const response = await axiosClient.post<BasicAuthResponse>(
      "/auth/reset-password-otp",
			payload
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Đổi mật khẩu thất bại");
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const errorCode = axiosError.response?.data?.code;
    const backendMessage = axiosError.response?.data?.message;
    const translatedMessage = getAuthErrorMessage(errorCode, backendMessage);
    throw new Error(translatedMessage);
  }
};

export const verifyEmailOtp = async (
	payload: VerifyEmailOtpPayload
): Promise<BasicAuthResponse> => {
  try {
    const response = await axiosClient.post<BasicAuthResponse>(
      "/auth/verify-email-otp",
			payload
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Xác thực email thất bại");
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string; code?: string }>;
    const errorCode = axiosError.response?.data?.code;
    const backendMessage = axiosError.response?.data?.message;
    const translatedMessage = getAuthErrorMessage(errorCode, backendMessage);
    throw new Error(translatedMessage);
  }
};

export const getMeService = async () => {
  return authRequestCache.run("auth:getMe", async () => {
    try {
      const response = await getMeApi();
      return response.data.data;
    } catch (error) {
      console.error("Can't find this auth: ", error);
      throw error;
    }
  });
};
