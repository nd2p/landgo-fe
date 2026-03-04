"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	requestPasswordResetOtp,
	resetPasswordWithOtp,
} from "@/features/auth/auth.service";
import { getAuthenticatedRedirectPath } from "@/lib/auth-bootstrap";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
const OTP_REGEX = /^\d{6}$/;
const DEFAULT_OTP_EXPIRES_SECONDS = 10 * 60;

export default function ForgotPasswordPage() {
	const router = useRouter();
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [isSendingOtp, setIsSendingOtp] = useState(false);
	const [isResetting, setIsResetting] = useState(false);

	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [sendMessage, setSendMessage] = useState("");
	const [resetMessage, setResetMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [otpRemainingSeconds, setOtpRemainingSeconds] = useState<number | null>(null);

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

	const validateEmail = (): boolean => {
		if (!email.trim()) {
			setErrorMessage("Vui lòng nhập email");
			return false;
		}

		if (!EMAIL_REGEX.test(email.trim())) {
			setErrorMessage("Email không đúng định dạng");
			return false;
		}

		return true;
	};

	const handleSendOtp = async () => {
		setErrorMessage("");
		setSendMessage("");
		setResetMessage("");

		if (!validateEmail()) return;

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

	const handleResetPassword = async () => {
		setErrorMessage("");
		setResetMessage("");

		if (!validateEmail()) return;

		if (!otp.trim()) {
			setErrorMessage("Vui lòng nhập mã OTP");
			return;
		}

		if (!OTP_REGEX.test(otp.trim())) {
			setErrorMessage("Mã OTP phải gồm 6 chữ số");
			return;
		}

		if (otpRemainingSeconds === null || otpRemainingSeconds <= 0) {
			setErrorMessage("Mã OTP đã hết hạn, vui lòng gửi lại mã mới");
			return;
		}

		if (!password.trim()) {
			setErrorMessage("Vui lòng nhập mật khẩu mới");
			return;
		}

		if (!PASSWORD_REGEX.test(password.trim())) {
			setErrorMessage("Mật khẩu tối thiểu 6 ký tự, gồm chữ và số");
			return;
		}

		if (password !== confirmPassword) {
			setErrorMessage("Mật khẩu nhập lại không khớp");
			return;
		}

		try {
			setIsResetting(true);
			const response = await resetPasswordWithOtp({
				email: email.trim(),
				otp: otp.trim(),
				password: password.trim(),
				confirmPassword: confirmPassword.trim(),
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
		<section className="bg-muted/30 py-10 md:py-14">
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
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="Nhập email đăng ký"
						/>
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
								value={otp}
								onChange={(event) => setOtp(event.target.value)}
								placeholder="Ví dụ: 123456"
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="password" className="text-sm font-medium">
								Mật khẩu mới
							</label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label htmlFor="confirmPassword" className="text-sm font-medium">
							Nhập lại mật khẩu mới
						</label>
						<Input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(event) => setConfirmPassword(event.target.value)}
						/>
					</div>

					<Button type="button" className="w-full" onClick={handleResetPassword} disabled={isResetting}>
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
