"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    BadgeDollarSign,
    Building2,
    ChevronRight,
    CircleUserRound,
    Crown,
    FileText,
    Landmark,
    LogOut,
    Map,
    MapPinned,
    Menu,
    Monitor,
    NotebookText,
    Tags,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authTokenChangedEventName, isLoggedIn as hasAccessToken } from "@/lib/auth-token";
import { logoutUser } from "@/features/auth/auth.service";

const MENU_ITEMS = [
    { label: "Mua bán", icon: Building2, to: "/estates" },
    { label: "Cho thuê", icon: BadgeDollarSign, to: "/rentals" },
    { label: "Bản đồ quy hoạch", icon: MapPinned, to: "/maps/urban-planning" },
    { label: "Kho bản đồ quy hoạch", icon: Map, to: "/maps/urban-planning-library" },
    { label: "Bản đồ giá nhà đất", icon: Landmark, to: "/maps/property-prices" },
    { label: "Dự án bất động sản", icon: Building2, to: "/projects" },
    { label: "Bảng giá đất 2026", icon: NotebookText },
    { label: "Danh sách môi giới", icon: Tags },
    { label: "Hướng dẫn check quy hoạch", icon: Monitor },
    { label: "Đăng tin & ký gửi nhà đất", icon: FileText },
    { label: "Nạp tiền đăng tin VIP", icon: BadgeDollarSign },
    { label: "Nâng VIP xem quy hoạch", icon: Crown },
];

const USER_MENU_ITEMS = [
    { label: "Thông tin cá nhân", to: "/profile" },
    { label: "Tin đã đăng", to: "/my-estates" },
    { label: "Tin đã thích", to: "/saved-estates" },
    { label: "CRM quản lý khách", to: "/crm/customers" },
    { label: "CRM quản lý nguồn hàng", to: "/crm/suppliers" },
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
                <div className="fixed inset-0 z-50 animate-in fade-in duration-200">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/55 animate-in fade-in duration-200"
                        onClick={() => setOpen(false)}
                        aria-label="Đóng menu"
                    />

                    <aside className="absolute left-3 top-3 bottom-3 w-70 overflow-y-auto bg-card rounded-2xl flex flex-col shadow-lg animate-in slide-in-from-left-96 duration-300">
                        {/* Logo */}
                        <div className="px-4 py-3 border-b">
                            <Image
                                src="/logo-landgo.png"
                                alt="LandGo"
                                width={170}
                                height={52}
                                className="h-auto w-auto max-w-35"
                            />
                        </div>

                        {/* Auth Links - Only show if not logged in */}
                        {!isLoggedIn && (
                            <div className="grid grid-cols-2 gap-2 p-4 border-b">
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-center gap-1 rounded-md bg-sky-50 px-3 py-2 text-sm font-medium text-sky-600 hover:bg-sky-100"
                                >
                                    <CircleUserRound className="size-4" />
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-center gap-1 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-100"
                                >
                                    <BadgeDollarSign className="size-4" />
                                    Đăng ký
                                </Link>
                            </div>
                        )}

                        {/* Main Menu */}
                        <nav className="flex-1 px-2 py-4 border-b">
                            {MENU_ITEMS.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.label}
                                        type="button"
                                        className="w-full flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-slate-100 transition-colors"
                                        onClick={() => {
                                            if (!item.to) return;
                                            setOpen(false);
                                            router.push(item.to);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="size-4 text-muted-foreground shrink-0" />
                                            <span>{item.label}</span>
                                        </div>
                                        <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                                    </button>
                                );
                            })}
                        </nav>

                        {/* User Section - Only show if logged in */}
                        {isLoggedIn && (
                            <div className="p-4 border-b">
                                <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                                    <div className="size-8 rounded-full bg-amber-400" />
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-foreground">Nguyễn Hoàng Anh</p>
                                        <p className="text-xs text-muted-foreground">Your account</p>
                                    </div>
                                </div>

                                <button className="w-full flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-100 mb-3">
                                    <Crown className="size-4" />
                                    Nâng cấp Pro
                                </button>

                                <div className="space-y-1">
                                    {USER_MENU_ITEMS.map((item) => (
                                        <button
                                            type="button"
                                            key={item.label}
                                            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-slate-100 transition-colors"
                                        >
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 mt-3"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                >
                                    <LogOut className="size-4" />
                                    {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                                </button>
                            </div>
                        )}
                    </aside>
                </div>
            )}
        </>
    );
}