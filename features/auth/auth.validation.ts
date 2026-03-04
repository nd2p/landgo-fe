import * as yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
const OTP_REGEX = /^\d{6}$/;

const isStrictValidVietnamPhone = (value?: string): boolean => {
	if (!value?.trim()) return false;
	const parsed = parsePhoneNumberFromString(value.trim(), "VN");
	return !!parsed && parsed.isValid() && parsed.country === "VN";
};

export const loginSchema = yup.object({
	phone: yup
		.string()
		.required("Vui lòng nhập số điện thoại")
		.test("vn-phone", "Số điện thoại không đúng định dạng Việt Nam", (value) =>
			isStrictValidVietnamPhone(value)
		),
	password: yup.string().required("Vui lòng nhập mật khẩu"),
});

export const registerSchema = yup.object({
	phone: yup
		.string()
		.required("Vui lòng nhập số điện thoại")
		.test("vn-phone", "Số điện thoại không đúng định dạng VN", (value) =>
			isStrictValidVietnamPhone(value)
		),
	fullName: yup
		.string()
		.required("Vui lòng nhập họ tên")
		.min(2, "Họ tên phải từ 2 đến 100 ký tự")
		.max(100, "Họ tên phải từ 2 đến 100 ký tự"),
	email: yup
		.string()
		.required("Vui lòng nhập email")
		.email("Email không đúng định dạng"),
	province: yup.string().required("Vui lòng chọn Tỉnh / Thành phố"),
	district: yup.string().required("Vui lòng chọn Quận / Huyện"),
	ward: yup.string().required("Vui lòng chọn Xã / Phường"),
	addressDetail: yup.string().default(""),
	password: yup
		.string()
		.required("Vui lòng nhập mật khẩu")
		.matches(PASSWORD_REGEX, "Mật khẩu tối thiểu 6 ký tự, gồm chữ và số"),
	confirmPassword: yup
		.string()
		.required("Vui lòng nhập lại mật khẩu")
		.oneOf([yup.ref("password")], "Mật khẩu nhập lại không khớp"),
});

export const forgotPasswordSchema = yup.object({
	email: yup
		.string()
		.required("Vui lòng nhập email")
		.email("Email không đúng định dạng"),
	otp: yup.string().optional(),
	password: yup.string().optional(),
	confirmPassword: yup.string().optional(),
});

export const resetPasswordSchema = yup.object({
	email: yup
		.string()
		.required("Vui lòng nhập email")
		.email("Email không đúng định dạng"),
	otp: yup
		.string()
		.required("Vui lòng nhập mã OTP")
		.matches(OTP_REGEX, "Mã OTP phải gồm 6 chữ số"),
	password: yup
		.string()
		.required("Vui lòng nhập mật khẩu mới")
		.matches(PASSWORD_REGEX, "Mật khẩu tối thiểu 6 ký tự, gồm chữ và số"),
	confirmPassword: yup
		.string()
		.required("Vui lòng nhập lại mật khẩu mới")
		.oneOf([yup.ref("password")], "Mật khẩu nhập lại không khớp"),
});

export const verifyEmailSchema = yup.object({
	email: yup
		.string()
		.required("Vui lòng nhập email")
		.email("Email không đúng định dạng"),
	otp: yup
		.string()
		.required("Vui lòng nhập mã OTP")
		.matches(OTP_REGEX, "Mã OTP phải gồm 6 chữ số"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
export type RegisterFormValues = yup.InferType<typeof registerSchema>;
export type ForgotPasswordFormValues = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = yup.InferType<typeof resetPasswordSchema>;
export type VerifyEmailFormValues = yup.InferType<typeof verifyEmailSchema>;
