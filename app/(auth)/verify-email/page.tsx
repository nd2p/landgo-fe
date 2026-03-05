"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyEmailOtp } from "@/features/auth/auth.service";
import { getAuthenticatedRedirectPath } from "@/lib/auth-bootstrap";
import {
	type VerifyEmailFormValues,
	verifyEmailSchema,
} from "@/features/auth/auth.validation";

function VerifyEmailContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const defaultEmail = searchParams.get("email") ?? "";
	const expiresAtFromQuery = Number(searchParams.get("expiresAt") ?? "");
	const expiresInSecondsFromQuery = Number(searchParams.get("expiresInSeconds") ?? "60");

	const fallbackDurationSeconds =
		Number.isFinite(expiresInSecondsFromQuery) && expiresInSecondsFromQuery > 0
			? expiresInSecondsFromQuery
			: 60;

	const expiresAtMs = useMemo(() => {
		const storageKey = `verify-email-expires-at:${defaultEmail || "anonymous"}`;

		if (Number.isFinite(expiresAtFromQuery) && expiresAtFromQuery > 0) {
			if (typeof window !== "undefined") {
				window.sessionStorage.setItem(storageKey, String(expiresAtFromQuery));
			}
			return expiresAtFromQuery;
		}

		if (typeof window !== "undefined") {
			const storedExpiresAt = Number(window.sessionStorage.getItem(storageKey) ?? "");
			if (Number.isFinite(storedExpiresAt) && storedExpiresAt > 0) {
				return storedExpiresAt;
			}

			const generatedExpiresAt = Date.now() + fallbackDurationSeconds * 1000;
			window.sessionStorage.setItem(storageKey, String(generatedExpiresAt));
			return generatedExpiresAt;
		}

		return Date.now() + fallbackDurationSeconds * 1000;
	}, [defaultEmail, expiresAtFromQuery, fallbackDurationSeconds]);

	const calculateRemainingSeconds = () => {
		const remainMs = expiresAtMs - Date.now();
		return remainMs > 0 ? Math.ceil(remainMs / 1000) : 0;
	};

	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [remainingSeconds, setRemainingSeconds] = useState(calculateRemainingSeconds);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<VerifyEmailFormValues>({
		resolver: yupResolver(verifyEmailSchema),
		defaultValues: {
			email: defaultEmail,
			otp: "",
		},
	});

	useEffect(() => {
		setValue("email", defaultEmail);
	}, [defaultEmail, setValue]);

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
		setRemainingSeconds(calculateRemainingSeconds());

		const timerId = window.setInterval(() => {
			setRemainingSeconds(calculateRemainingSeconds());
		}, 1000);

		return () => {
			window.clearInterval(timerId);
		};
	}, [expiresAtMs]);

	const countdownText = useMemo(() => {
		const minutes = Math.floor(remainingSeconds / 60);
		const seconds = remainingSeconds % 60;
		return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	}, [remainingSeconds]);

	const handleVerify = async (values: VerifyEmailFormValues) => {
		setErrorMessage("");
		setMessage("");

		if (remainingSeconds <= 0) {
			setErrorMessage("Mã OTP đã hết hạn, vui lòng đăng ký lại để nhận mã mới");
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await verifyEmailOtp({
				email: values.email.trim(),
				otp: values.otp.trim(),
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
		<section className="min-h-[calc(100vh-4rem)] bg-[#fbfbfb] py-10 md:py-14">
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
							{...register("email")}
						/>
						{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
					</div>

					<div className="space-y-2">
						<label htmlFor="otp" className="text-sm font-medium">
							Mã OTP 6 số
						</label>
						<Input
							id="otp"
							{...register("otp")}
							placeholder="Ví dụ: 123456"
						/>
						{errors.otp && <p className="text-sm text-destructive">{errors.otp.message}</p>}
					</div>

					<p className={`text-sm ${remainingSeconds > 0 ? "text-amber-600" : "text-destructive"}`}>
						{remainingSeconds > 0
							? `Mã OTP còn hiệu lực: ${countdownText}`
							: "Mã OTP đã hết hạn, vui lòng đăng ký lại để nhận mã mới"}
					</p>

					<Button type="button" className="w-full" onClick={handleSubmit(handleVerify)} disabled={isSubmitting}>
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

export default function VerifyEmailPage() {
	return (
		<Suspense fallback={null}>
			<VerifyEmailContent />
		</Suspense>
	);
}
