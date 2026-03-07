"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authTokenChangedEventName, isLoggedIn as hasAccessToken } from "@/lib/auth-token";
import Menubar from "@/components/common/layout/menubar";
import FilterDropdown from "@/components/common/layout/filter-dropdown";

export default function Navbar() {
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    return (
        <header className={isAuthPage ? "bg-[#fbfbfb]" : "bg-background"}>
            <nav className="flex h-16 w-full items-center justify-around gap-200 px-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex items-center">
                        <Menubar />
                    </div>

                    <Link href="/" className="shrink-0" aria-label="LandGo Home">
                        <Image src="/logo-landgo.png" alt="LandGo" width={96} height={32} priority className="h-8 w-auto" />
                    </Link>

                    <div className="hidden min-w-0 flex-1 items-center gap-2 md:flex">
                        <div className="relative min-w-0 flex-1">
                            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input className="pl-9" placeholder="Tìm kiếm bất động sản" aria-label="Search estates" />
                        </div>

                        <FilterDropdown />
                    </div>
                </div>

                <div className="hidden shrink-0 items-center gap-2 md:flex">
                    {!isLoggedIn && (
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
