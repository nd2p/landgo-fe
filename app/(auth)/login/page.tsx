"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/features/auth/auth.service";
import { getAuthenticatedRedirectPath } from "@/lib/auth-bootstrap";
import { getHomePathByRole } from "@/lib/auth-role";

const isStrictValidVietnamPhone = (value: string): boolean => {
    const parsed = parsePhoneNumberFromString(value.trim(), "VN");
    return !!parsed && parsed.isValid() && parsed.country === "VN";
};

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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

    const validateForm = (): boolean => {
        if (!phone.trim()) {
            setErrorMessage("Vui lòng nhập số điện thoại");
            return false;
        }

        if (!isStrictValidVietnamPhone(phone)) {
            setErrorMessage("Số điện thoại không đúng định dạng Việt Nam");
            return false;
        }

        if (!password.trim()) {
            setErrorMessage("Vui lòng nhập mật khẩu");
            return false;
        }

        setErrorMessage("");
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            const response = await loginUser({
                phone: phone.trim(),
                password,
            });

            const redirectPath = getHomePathByRole(response.data.user.role);
            router.push(redirectPath);
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Đăng nhập thất bại"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isCheckingAuth) {
        return null;
    }

    return (
        <section className="bg-muted/30 py-10 md:py-14">
            <div className="mx-auto w-full max-w-3xl rounded-lg border bg-card p-6 shadow-sm md:p-8">
                <h1 className="text-3xl font-bold uppercase">Đăng nhập</h1>

                <p className="mt-3 text-sm">
                    Nếu chưa là thành viên, vui lòng{" "}
                    <Link href="/register" className="font-semibold text-primary underline">
                        Đăng ký thành viên
                    </Link>
                </p>

                <div className="my-4 h-px w-full bg-border" />

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                            Số điện thoại
                        </label>
                        <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((previous) => !previous)}
                                className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-destructive">{errorMessage}</p>
                    )}
                    
                    <Button
                        type="submit"
                        className="w-full text-lg font-semibold"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                </form>
            </div>
        </section>
    );
}