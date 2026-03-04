"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyEmailOtp } from "@/features/auth/auth.service";
import { getAuthenticatedRedirectPath } from "@/lib/auth-bootstrap";

const OTP_REGEX = /^\d{6}$/;

export default function VerifyEmailPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const defaultEmail = searchParams.get("email") ?? "";
	const expiresInSecondsFromQuery = Number(searchParams.get("expiresInSeconds") ?? "60");
	const initialSeconds = Number.isFinite(expiresInSecondsFromQuery) && expiresInSecondsFromQuery > 0
		? expiresInSecondsFromQuery
		: 60;

	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [email, setEmail] = useState(defaultEmail);
	const [otp, setOtp] = useState("");
	const [message, setMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

	useEffect(() => {
		setEmail(defaultEmail);
	}, [defaultEmail]);

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
		if (remainingSeconds <= 0) return;

		const timerId = window.setInterval(() => {
			setRemainingSeconds((previous) => (previous <= 1 ? 0 : previous - 1));
		}, 1000);

		return () => {
			window.clearInterval(timerId);
		};
	}, [remainingSeconds]);

	const countdownText = useMemo(() => {
		const minutes = Math.floor(remainingSeconds / 60);
		const seconds = remainingSeconds % 60;
		return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	}, [remainingSeconds]);

	const handleVerify = async () => {
		setErrorMessage("");
		setMessage("");

		if (!email.trim()) {
			setErrorMessage("Vui lòng nhập email");
			return;
		}

		if (!OTP_REGEX.test(otp.trim())) {
			setErrorMessage("Mã OTP phải gồm 6 chữ số");
			return;
		}

		if (remainingSeconds <= 0) {
			setErrorMessage("Mã OTP đã hết hạn, vui lòng đăng ký lại để nhận mã mới");
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await verifyEmailOtp({
				email: email.trim(),
				otp: otp.trim(),
			});
			setMessage(response.message);
			setTimeout(() => {
				router.push("/login");
			}, 1200);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "Xác thực email thất bại");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isCheckingAuth) return null;

	return (
		<section className="bg-muted/30 py-10 md:py-14">
			<div className="mx-auto w-full max-w-xl rounded-lg border bg-card p-6 shadow-sm md:p-8">
				<h1 className="text-2xl font-bold uppercase">Xác thực email</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Nhập mã OTP đã gửi về email để hoàn tất đăng ký.
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
						/>
					</div>

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

					<p className={`text-sm ${remainingSeconds > 0 ? "text-amber-600" : "text-destructive"}`}>
						{remainingSeconds > 0
							? `Mã OTP còn hiệu lực: ${countdownText}`
							: "Mã OTP đã hết hạn, vui lòng đăng ký lại để nhận mã mới"}
					</p>

					<Button type="button" className="w-full" onClick={handleVerify} disabled={isSubmitting}>
						{isSubmitting ? "Đang xác thực..." : "Xác thực email"}
					</Button>

					{message ? <p className="text-sm text-emerald-600">{message}</p> : null}
					{errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

					<p className="text-sm">
						Quay lại <Link href="/register" className="font-semibold text-primary underline">Đăng ký</Link>
					</p>
				</div>
			</div>
		</section>
	);
}
