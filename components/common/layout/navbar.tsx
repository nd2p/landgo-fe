"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  authTokenChangedEventName,
  isLoggedIn as hasAccessToken,
} from "@/lib/auth-token";
import { MenubarToggle } from "@/components/common/layout/menubar";
import FilterDropdown from "@/components/common/layout/filter-dropdown";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/verify-email";

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;

        // Always show at the top of the page (within 50px)
        if (currentScrollY < 50) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY) {
          // Scrolling down - hide it
          setIsVisible(false);
        } else {
          // Scrolling up - show it
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

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
    <header
      className={`${isAuthPage ? "bg-[#fbfbfb]" : "bg-background"} sticky top-0 z-50 border-b border-border shadow-sm transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <nav className="flex h-16 w-full items-center justify-between gap-4 pl-4 pr-2 sm:pr-4">
        {/* Left Group: Menu and Logo + Search Desktop */}
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <MenubarToggle />
          <Link
            href="/"
            className="shrink-0 flex items-center"
            aria-label="LandGo Home"
          >
            <Image
              src="/logo-landgo.png"
              alt="LandGo"
              width={96}
              height={32}
              priority
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Search (Hidden on Mobile) */}
          <div className="hidden flex-1 items-center gap-2 md:flex max-w-3xl px-2">
            <div className="relative flex-1">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                className="pl-9 h-10 w-full bg-slate-50 border-none shadow-none focus-visible:ring-1 focus-visible:ring-slate-300"
                placeholder="Tìm kiếm bất động sản"
                aria-label="Search estates"
              />
            </div>
            <FilterDropdown />
          </div>
        </div>

        {/* Right Group: Action Button */}
        <div className="flex items-center gap-3 shrink-0 pr-2">
          <div className="hidden items-center gap-2 md:flex">
            {!isLoggedIn && (
              <>
                <Button asChild variant="ghost" className="text-sm font-medium">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="text-sm font-medium"
                >
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </>
            )}
          </div>
          {isLoggedIn && (
            <Button
              asChild
              className="inline-flex shadow-sm text-xs sm:text-sm px-4 h-9"
            >
              <Link href="/estates/create">Đăng tin</Link>
            </Button>
          )}
        </div>
      </nav>

      <div className="flex px-4 pb-3 gap-2 md:hidden">
        <div className="relative flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            className="pl-9 h-10"
            placeholder="Tìm kiếm bất động sản"
            aria-label="Search estates mobile"
          />
        </div>
        <FilterDropdown />
      </div>
    </header>
  );
}
