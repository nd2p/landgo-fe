"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	requestPasswordResetOtp,
	resetPasswordWithOtp,
} from "@/features/auth/auth.service";
import { getAuthenticatedRedirectPath } from "@/lib/auth-bootstrap";
import {
	type ResetPasswordFormValues,
	resetPasswordSchema,
} from "@/features/auth/auth.validation";

const DEFAULT_OTP_EXPIRES_SECONDS = 10 * 60;

export default function ForgotPasswordPage() {
	const router = useRouter();
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [isSendingOtp, setIsSendingOtp] = useState(false);
	const [isResetting, setIsResetting] = useState(false);

	const [sendMessage, setSendMessage] = useState("");
	const [resetMessage, setResetMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [otpRemainingSeconds, setOtpRemainingSeconds] = useState<number | null>(null);

	const {
		register,
		getValues,
		handleSubmit,
		trigger,
		formState: { errors },
	} = useForm<ResetPasswordFormValues>({
		resolver: yupResolver(resetPasswordSchema),
		defaultValues: {
			email: "",
			otp: "",
			password: "",
			confirmPassword: "",
		},
	});

	useEffect(() => {
		const guardAuthPage = async () => {
			const redirectPath = await getAuthenticatedRedirectPath();

			if (redirectPath) {
				router.replace(redirectPath);
				return;
			}

			setIsCheckingAuth(false);
		};

		void guardAuthPage();
	}, [router]);

	useEffect(() => {
		if (otpRemainingSeconds === null || otpRemainingSeconds <= 0) return;

		const timerId = window.setInterval(() => {
			setOtpRemainingSeconds((previous) => {
				if (previous === null || previous <= 1) {
					window.clearInterval(timerId);
					return 0;
				}
				return previous - 1;
			});
		}, 1000);

		return () => {
			window.clearInterval(timerId);
		};
	}, [otpRemainingSeconds]);

	const formatCountdown = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainSeconds = seconds % 60;
		return `${String(minutes).padStart(2, "0")}:${String(remainSeconds).padStart(2, "0")}`;
	};

	const handleSendOtp = async () => {
		setErrorMessage("");
		setSendMessage("");
		setResetMessage("");

		const email = getValues("email");
		const isEmailValid = await trigger("email");
		if (!isEmailValid) return;

		try {
			setIsSendingOtp(true);
			const response = await requestPasswordResetOtp({ email: email.trim() });
			setSendMessage(response.message);
			setOtpRemainingSeconds(
				response.data?.expiresInSeconds ?? DEFAULT_OTP_EXPIRES_SECONDS
			);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "Gửi OTP thất bại");
		} finally {
			setIsSendingOtp(false);
		}
	};

	const handleResetPassword = async (values: ResetPasswordFormValues) => {
		setErrorMessage("");
		setResetMessage("");

		if (otpRemainingSeconds === null || otpRemainingSeconds <= 0) {
			setErrorMessage("Mã OTP đã hết hạn, vui lòng gửi lại mã mới");
			return;
		}

		try {
			setIsResetting(true);
			const response = await resetPasswordWithOtp({
				email: values.email.trim(),
				otp: values.otp.trim(),
				password: values.password.trim(),
				confirmPassword: values.confirmPassword.trim(),
			});

			setResetMessage(response.message);
			setTimeout(() => {
				router.push("/login");
			}, 1200);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "Đổi mật khẩu thất bại");
		} finally {
			setIsResetting(false);
		}
	};

	if (isCheckingAuth) return null;

	return (
		<section className="min-h-[calc(100vh-4rem)] bg-[#fbfbfb] py-10 md:py-14">
			<div className="mx-auto w-full max-w-3xl rounded-lg border bg-card p-6 shadow-sm md:p-8">
				<h1 className="text-2xl font-bold uppercase">Quên mật khẩu</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Nhập email để nhận mã OTP 6 số, sau đó đổi mật khẩu mới.
				</p>

				<div className="mt-6 space-y-4">
					<div className="space-y-2">
						<label htmlFor="email" className="text-sm font-medium">
							Email
						</label>
						<Input
							id="email"
							type="email"
							{...register("email")}
							placeholder="Nhập email đăng ký"
						/>
						{errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
					</div>

					<Button type="button" variant="outline" onClick={handleSendOtp} disabled={isSendingOtp}>
						{isSendingOtp ? "Đang gửi OTP..." : otpRemainingSeconds ? "Gửi lại mã OTP" : "Gửi mã OTP"}
					</Button>
					{otpRemainingSeconds !== null ? (
						<p className={`text-sm ${otpRemainingSeconds > 0 ? "text-amber-600" : "text-destructive"}`}>
							{otpRemainingSeconds > 0
								? `Mã OTP sẽ hết hạn sau: ${formatCountdown(otpRemainingSeconds)}`
								: "Mã OTP đã hết hạn, vui lòng gửi lại mã mới"}
						</p>
					) : null}

					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<label htmlFor="otp" className="text-sm font-medium">
								Mã OTP 6 số
							</label>
							<Input
								id="otp"
								{...register("otp")}
								placeholder="Ví dụ: 123456"
							/>
							{errors.otp && <p className="text-xs text-destructive">{errors.otp.message}</p>}
						</div>
						<div className="space-y-2">
							<label htmlFor="password" className="text-sm font-medium">
								Mật khẩu mới
							</label>
							<Input
								id="password"
								type="password"
								{...register("password")}
							/>
							{errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
						</div>
					</div>

					<div className="space-y-2">
						<label htmlFor="confirmPassword" className="text-sm font-medium">
							Nhập lại mật khẩu mới
						</label>
						<Input
							id="confirmPassword"
							type="password"
							{...register("confirmPassword")}
						/>
						{errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
					</div>

					<Button type="button" className="w-full" onClick={handleSubmit(handleResetPassword)} disabled={isResetting}>
						{isResetting ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
					</Button>

					{sendMessage ? <p className="text-sm text-emerald-600">{sendMessage}</p> : null}
					{resetMessage ? <p className="text-sm text-emerald-600">{resetMessage}</p> : null}
					{errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

					<p className="text-sm">
						Quay lại <Link href="/login" className="font-semibold text-primary underline">Đăng nhập</Link>
					</p>
				</div>
			</div>
		</section>
	);
}
