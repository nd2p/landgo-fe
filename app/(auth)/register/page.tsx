"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { registerUser } from "@/features/auth/auth.service";
import { getAuthenticatedRedirectPath } from "@/lib/auth-bootstrap";
import {
    registerSchema,
    type RegisterFormValues,
} from "@/features/auth/auth.validation";

type Province = {
    code: number;
    name: string;
};

type District = {
    code: number;
    name: string;
    province_code: number;
};

type Ward = {
    code: number;
    name: string;
    district_code: number;
};

export default function RegisterPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [submitError, setSubmitError] = useState("");

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            phone: "",
            fullName: "",
            email: "",
            addressDetail: "",
            province: "",
            district: "",
            ward: "",
            password: "",
            confirmPassword: "",
        },
    });

    const province = watch("province");
    const district = watch("district");
    const ward = watch("ward");

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
        const fetchProvinces = async () => {
            try {
                const response = await fetch("https://provinces.open-api.vn/api/v1/p/");
                if (!response.ok) {
                    throw new Error("Không thể tải danh sách tỉnh/thành phố");
                }

                const data: Province[] = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error(error);
            }
        };

        void fetchProvinces();
    }, []);

    useEffect(() => {
        if (!province) {
            setDistricts([]);
            return;
        }

        const fetchDistricts = async () => {
            try {
                const response = await fetch("https://provinces.open-api.vn/api/v1/d/");
                if (!response.ok) {
                    throw new Error("Không thể tải danh sách quận/huyện");
                }

                const data: District[] = await response.json();
                const provinceCode = Number(province);
                setDistricts(
                    data.filter((item) => item.province_code === provinceCode)
                );
            } catch (error) {
                console.error(error);
                setDistricts([]);
            }
        };

        void fetchDistricts();
    }, [province]);

    useEffect(() => {
        if (!district) {
            setWards([]);
            return;
        }

        const fetchWards = async () => {
            try {
                const response = await fetch("https://provinces.open-api.vn/api/v1/w/");
                if (!response.ok) {
                    throw new Error("Không thể tải danh sách xã/phường");
                }

                const data: Ward[] = await response.json();
                const districtCode = Number(district);
                setWards(data.filter((item) => item.district_code === districtCode));
            } catch (error) {
                console.error(error);
                setWards([]);
            }
        };

        void fetchWards();
    }, [district]);

    const onSubmit = async (values: RegisterFormValues) => {
        setSubmitError("");

        try {
            setIsSubmitting(true);

            const selectedProvince = provinces.find(
                (item) => String(item.code) === province
            );
            const selectedDistrict = districts.find(
                (item) => String(item.code) === district
            );
            const selectedWard = wards.find((item) => String(item.code) === ward);

            if (!selectedProvince || !selectedDistrict || !selectedWard) {
                throw new Error("Không tìm thấy thông tin địa chỉ đã chọn");
            }

            const response = await registerUser({
                phone: values.phone.trim(),
                email: values.email.trim(),
                name: values.fullName.trim(),
                password: values.password.trim(),
                confirmPassword: values.confirmPassword.trim(),
                provinceCode: String(selectedProvince.code),
                provinceName: selectedProvince.name,
                districtCode: String(selectedDistrict.code),
                districtName: selectedDistrict.name,
                wardCode: String(selectedWard.code),
                wardName: selectedWard.name,
                addressDetail: values.addressDetail?.trim() || undefined,
            });

            const query = new URLSearchParams({
                email: values.email.trim(),
                expiresInSeconds: String(response.data.emailOtpExpiresInSeconds ?? 60),
                expiresAt: String(
                    Date.now() + (response.data.emailOtpExpiresInSeconds ?? 60) * 1000
                ),
            });

            router.push(`/verify-email?${query.toString()}`);
        } catch (error) {
            console.error(error);
            setSubmitError(
                error instanceof Error ? error.message : "Đăng ký thất bại, vui lòng thử lại"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isCheckingAuth) {
        return null;
    }

    return (
        <section className="bg-muted/30 py-8 md:py-10">
            <div className="mx-auto w-full max-w-3xl rounded-lg border bg-card p-6 shadow-sm md:p-8">
                <h1 className="text-2xl font-bold uppercase">Đăng ký thành viên</h1>
                <p className="mt-2 text-sm">
                    Nếu đã là thành viên, vui lòng{" "}
                    <Link href="/login" className="font-semibold text-primary underline">
                        Đăng nhập
                    </Link>
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="phone" className="required text-sm font-medium">
                            Số điện thoại
                        </label>
                        <Input
                            id="phone"
                            type="tel"
                            {...register("phone")}
                            placeholder="Nhập số điện thoại"
                            required
                        />
                        {errors.phone && (
                            <p className="text-xs text-destructive">{errors.phone.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="fullName" className="required text-sm font-medium">
                            Họ tên
                        </label>
                        <Input
                            id="fullName"
                            {...register("fullName")}
                            placeholder="Nhập họ tên"
                            required
                        />
                        {errors.fullName && (
                            <p className="text-xs text-destructive">{errors.fullName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="required text-sm font-medium">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="Nhập email"
                            required
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tỉnh / Thành phố</label>
                        <Controller
                            control={control}
                            name="province"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setValue("district", "");
                                        setValue("ward", "");
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="- Chọn -" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provinces.map((item) => (
                                            <SelectItem key={item.code} value={String(item.code)}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.province && (
                            <p className="text-xs text-destructive">{errors.province.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Quận / Huyện</label>
                        <Controller
                            control={control}
                            name="district"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setValue("ward", "");
                                    }}
                                    disabled={!province}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="- Chọn -" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts.map((item) => (
                                            <SelectItem key={item.code} value={String(item.code)}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.district && (
                            <p className="text-xs text-destructive">{errors.district.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Xã / Phường</label>
                        <Controller
                            control={control}
                            name="ward"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange} disabled={!district}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="- Chọn -" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {wards.map((item) => (
                                            <SelectItem key={item.code} value={String(item.code)}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.ward && (
                            <p className="text-xs text-destructive">{errors.ward.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="addressDetail" className="text-sm font-medium">
                            Địa chỉ chi tiết
                        </label>
                        <Input
                            id="addressDetail"
                            {...register("addressDetail")}
                            placeholder="Ví dụ: Số nhà, tên đường..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="required text-sm font-medium">
                            Mật khẩu của bạn (đặt dễ nhớ để đăng nhập)
                        </label>
                        <Input
                            id="password"
                            type="password"
                            {...register("password")}
                            required
                        />
                        {errors.password && (
                            <p className="text-xs text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="confirmPassword"
                            className="required text-sm font-medium"
                        >
                            Nhập lại mật khẩu
                        </label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            {...register("confirmPassword")}
                            required
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {submitError && <p className="text-sm text-destructive">{submitError}</p>}

                    <p className="pt-2 text-xs text-muted-foreground">
                        Khi đăng ký làm thành viên, bạn sẽ đồng ý với Điều khoản, Chính sách và
                        Quy định của LandGo.
                    </p>

                    <Button
                        type="submit"
                        className="mt-1 w-full text-base font-semibold"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                </form>
            </div>
        </section>
    );
}