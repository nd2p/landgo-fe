"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isValidPhoneNumber } from "libphonenumber-js";

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

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState("");

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

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

    const handleProvinceChange = (value: string) => {
        setProvince(value);
        setDistrict("");
        setWard("");
    };

    const handleDistrictChange = (value: string) => {
        setDistrict(value);
        setWard("");
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

        if (!phone.trim()) {
            errors.phone = "Vui lòng nhập số điện thoại";
        } else if (!isValidPhoneNumber(phone.trim(), "VN")) {
            errors.phone = "Số điện thoại không đúng định dạng VN";
        }

        if (!fullName.trim()) {
            errors.fullName = "Vui lòng nhập họ tên";
        } else if (fullName.trim().length < 2 || fullName.trim().length > 100) {
            errors.fullName = "Họ tên phải từ 2 đến 100 ký tự";
        }

        if (!province) errors.province = "Vui lòng chọn Tỉnh / Thành phố";
        if (!district) errors.district = "Vui lòng chọn Quận / Huyện";
        if (!ward) errors.ward = "Vui lòng chọn Xã / Phường";

        if (!password.trim()) {
            errors.password = "Vui lòng nhập mật khẩu";
        } else if (!passwordRegex.test(password.trim())) {
            errors.password = "Mật khẩu tối thiểu 6 ký tự, gồm chữ và số";
        }

        if (!confirmPassword.trim()) {
            errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
        } else if (confirmPassword !== password) {
            errors.confirmPassword = "Mật khẩu nhập lại không khớp";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError("");

        if (!validateForm()) {
            return;
        }

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

            await registerUser({
                phone: phone.trim(),
                name: fullName.trim(),
                password: password.trim(),
                confirmPassword: confirmPassword.trim(),
                provinceCode: String(selectedProvince.code),
                provinceName: selectedProvince.name,
                districtCode: String(selectedDistrict.code),
                districtName: selectedDistrict.name,
                wardCode: String(selectedWard.code),
                wardName: selectedWard.name,
            });

            router.push("/login");
        } catch (error) {
            console.error(error);
            setSubmitError(
                error instanceof Error ? error.message : "Đăng ký thất bại, vui lòng thử lại"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

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

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="phone" className="required text-sm font-medium">
                            Số điện thoại
                        </label>
                        <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            placeholder="Nhập số điện thoại"
                            required
                        />
                        {fieldErrors.phone && (
                            <p className="text-xs text-destructive">{fieldErrors.phone}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="fullName" className="required text-sm font-medium">
                            Họ tên
                        </label>
                        <Input
                            id="fullName"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            placeholder="Nhập họ tên"
                            required
                        />
                        {fieldErrors.fullName && (
                            <p className="text-xs text-destructive">{fieldErrors.fullName}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tỉnh / Thành phố</label>
                        <Select value={province} onValueChange={handleProvinceChange}>
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
                        {fieldErrors.province && (
                            <p className="text-xs text-destructive">{fieldErrors.province}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Quận / Huyện</label>
                        <Select
                            value={district}
                            onValueChange={handleDistrictChange}
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
                        {fieldErrors.district && (
                            <p className="text-xs text-destructive">{fieldErrors.district}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Xã / Phường</label>
                        <Select value={ward} onValueChange={setWard} disabled={!district}>
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
                        {fieldErrors.ward && (
                            <p className="text-xs text-destructive">{fieldErrors.ward}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="required text-sm font-medium">
                            Mật khẩu của bạn (đặt dễ nhớ để đăng nhập)
                        </label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                        {fieldErrors.password && (
                            <p className="text-xs text-destructive">{fieldErrors.password}</p>
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
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                        {fieldErrors.confirmPassword && (
                            <p className="text-xs text-destructive">
                                {fieldErrors.confirmPassword}
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