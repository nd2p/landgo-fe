"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    BadgeDollarSign,
    Building2,
    CircleUserRound,
    Crown,
    FileText,
    Landmark,
    List,
    Map,
    MapPinned,
    Menu,
    Monitor,
    NotebookText,
    PhoneCall,
    Tags,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authTokenChangedEventName, isLoggedIn as hasAccessToken } from "@/lib/auth-token";
import { logoutUser } from "@/features/auth/auth.service";

const MENU_ITEMS = [
    { label: "Mua bán", icon: Building2 },
    { label: "Cho thuê", icon: BadgeDollarSign },
    { label: "Bản đồ quy hoạch", icon: MapPinned },
    { label: "Kho bản đồ quy hoạch", icon: Map },
    { label: "Bản đồ giá nhà đất", icon: Landmark },
    { label: "Dự án bất động sản", icon: Building2 },
    { label: "Bảng giá đất 2026", icon: NotebookText },
    { label: "Danh sách môi giới", icon: Tags },
    { label: "Hướng dẫn check quy hoạch", icon: Monitor },
    { label: "Đăng tin & ký gửi nhà đất", icon: FileText },
    { label: "Nạp tiền đăng tin VIP", icon: BadgeDollarSign },
    { label: "Nâng VIP xem quy hoạch", icon: Crown },
];

const USER_MENU_ITEMS = [
    "Thông tin cá nhân",
    "Tin đã đăng",
    "Tin đã thích",
    "CRM quản lý khách",
    "CRM quản lý nguồn hàng",
];

export default function Menubar() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const syncAuthState = () => {
            setIsLoggedIn(hasAccessToken());
        };

        syncAuthState();
        window.addEventListener("storage", syncAuthState);
        window.addEventListener(authTokenChangedEventName, syncAuthState);

        return () => {
            window.removeEventListener("storage", syncAuthState);
            window.removeEventListener(authTokenChangedEventName, syncAuthState);
        };
    }, []);

    const handleLogout = async () => {
        if (isLoggingOut) return;

        try {
            setIsLoggingOut(true);
            await logoutUser();
        } catch {
            // ignore logout API error and still force redirect to login
        } finally {
            setOpen(false);
            setIsLoggingOut(false);
            router.replace("/login");
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                type="button"
                aria-label="Mở danh mục"
                onClick={() => setOpen(true)}
            >
                <Menu className="size-5" />
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex">
                    <button
                        type="button"
                        className="h-full flex-1 bg-black/55"
                        onClick={() => setOpen(false)}
                        aria-label="Đóng menu"
                    />

                    <aside className="h-full w-[72%] max-w-sm overflow-y-auto border-l bg-card">
                        <div className="border-b p-3">
                            <Image
                                src="/logo-landgo.png"
                                alt="LandGo"
                                width={170}
                                height={52}
                                className="mx-auto h-auto w-[170px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 border-b">
                            {isLoggedIn ? null : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-2 border-r border-b px-4 py-3 text-base font-medium"
                                    >
                                        <CircleUserRound className="size-5 text-sky-500" />
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-2 border-b px-4 py-3 text-base font-medium"
                                    >
                                        <BadgeDollarSign className="size-5 text-emerald-500" />
                                        Đăng ký
                                    </Link>
                                </>
                            )}

                            {MENU_ITEMS.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.label}
                                        type="button"
                                        className="flex items-center gap-2 border-r border-b px-3 py-3 text-left text-sm leading-5 font-medium odd:border-r last:border-r-0"
                                    >
                                        <Icon className="size-4 text-muted-foreground" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="border-b px-4 py-4 text-center">
                            <p className="text-2xl font-extrabold leading-tight text-slate-800">
                                ĐANG CÓ NGUỒN BĐS VAY CHÊNH
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Giá bán chỉ bằng 30%-50% so với định giá, thấp hơn mức
                                ngân hàng cho vay 15%-30%, hỗ trợ hạn mức vay.
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Anh chị đầu tư có sẵn tài chính hoặc hạn mức vay trên 30 tỷ,
                                quan tâm dạng tài sản này, vui lòng liên hệ:
                            </p>
                            <Button className="mt-3 gap-2 px-5">
                                <PhoneCall className="size-4" />
                                TÔI QUAN TÂM
                            </Button>
                        </div>

                        {isLoggedIn ? (
                            <div className="border-b">
                                <div className="px-5 py-4 text-lg font-semibold leading-6">
                                    Nguyễn Hoàng Anh
                                </div>
                                {USER_MENU_ITEMS.map((item) => (
                                    <button
                                        type="button"
                                        key={item}
                                        className="block w-full border-t px-5 py-3 text-left text-base font-medium leading-6"
                                    >
                                        {item}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    className="block w-full border-t px-5 py-4 text-left text-base font-semibold leading-6"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                >
                                    {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                                </button>
                            </div>
                        ) : null}

                        <div className="flex items-center justify-center gap-3 p-4">
                            <button
                                type="button"
                                className="rounded-md bg-black px-4 py-2 text-xs font-semibold text-white"
                            >
                                Download on the App Store
                            </button>
                            <button
                                type="button"
                                className="rounded-md bg-black px-4 py-2 text-xs font-semibold text-white"
                            >
                                Android App on Google Play
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}