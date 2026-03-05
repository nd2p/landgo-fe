"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/features/auth/auth.service";
import { getAuthenticatedRedirectPath } from "@/lib/auth-bootstrap";
import { getHomePathByRole } from "@/lib/auth-role";
import { loginSchema, type LoginFormValues } from "@/features/auth/auth.validation";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            phone: "",
            password: "",
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

    const onSubmit = async (values: LoginFormValues) => {
        setErrorMessage("");

        try {
            setIsSubmitting(true);
            const response = await loginUser({
                phone: values.phone.trim(),
                password: values.password,
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
        <section className="min-h-[calc(100vh-4rem)] bg-[#fbfbfb] py-10 md:py-14">
            <div className="mx-auto w-full max-w-3xl rounded-lg border bg-card p-6 shadow-sm md:p-8">
                <h1 className="text-3xl font-bold uppercase">Đăng nhập</h1>

                <p className="mt-3 text-sm">
                    Nếu chưa là thành viên, vui lòng{" "}
                    <Link href="/register" className="font-semibold text-primary underline">
                        Đăng ký thành viên
                    </Link>
                </p>

                <div className="my-4 h-px w-full bg-border" />

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                            Số điện thoại
                        </label>
                        <Input
                            id="phone"
                            type="tel"
                            {...register("phone")}
                        />
                        {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="pr-10"
                                {...register("password")}
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
                        <p className="text-right text-sm">
                            <Link href="/forgot-password" className="font-medium text-primary underline">
                                Quên mật khẩu?
                            </Link>
                        </p>
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
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