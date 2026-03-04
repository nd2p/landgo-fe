"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { authTokenChangedEventName, isLoggedIn as hasAccessToken } from "@/lib/auth-token";
import Menubar from "@/components/common/layout/menubar";
import { logoutUser } from "@/features/auth/auth.service";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/verify-email";

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
            setIsMenuOpen(false);
            setIsLoggingOut(false);
            router.replace("/login");
        }
    };

    return (
        <header className={isAuthPage ? "bg-[#fbfbfb]" : "bg-background"}>
            <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4">
                <div className="flex items-center">
                    <Menubar />
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Link href="/" className="shrink-0" aria-label="LandGo Home">
                        <Image src="/logo-landgo.png" alt="LandGo" width={96} height={32} priority className="h-8 w-auto" />
                    </Link>

                    <div className="hidden min-w-0 flex-1 items-center gap-2 md:flex">
                        <div className="relative min-w-0 flex-1">
                            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input className="pl-9" placeholder="Tìm kiếm bất động sản" aria-label="Search estates" />
                        </div>

                        <Select defaultValue="all" >
                            <SelectTrigger className="w-full max-w-48" aria-label="Filter estates">
                                <SelectValue placeholder="Bộ lọc" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="rent">Cho thuê</SelectItem>
                                    <SelectItem value="sale">Mua bán</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="hidden shrink-0 items-center gap-2 md:flex">
                    {isLoggedIn ? (
                        <div className="relative">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setIsMenuOpen((previous) => !previous)}
                            >
                                Tài khoản
                            </Button>
                            {isMenuOpen && (
                                <div className="absolute right-0 z-50 mt-2 min-w-28 rounded-md border bg-card p-2 shadow-md">
                                    <button
                                        type="button"
                                        className="w-full rounded-sm px-2 py-1 text-left text-sm hover:bg-accent"
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                    >
                                        {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Button asChild variant="outline">
                                <Link href="/login">Đăng nhập</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/register">Đăng ký</Link>
                            </Button>
                        </>
                    )}
                    <Button asChild>
                        <Link href="/estates/create">Đăng tin</Link>
                    </Button>
                </div>
            </nav>
        </header>
    );
}
