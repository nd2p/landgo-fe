"use client";

import Link from "next/link";
import Image from "next/image";
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

export default function Navbar() {
    return (
        <header>
            <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Link href="/" className="shrink-0" aria-label="LandGo Home">
                        <Image src="/logo-landgo.png" alt="LandGo" width={96} height={32} priority className="h-8 w-auto" />
                    </Link>

                    <div className="flex min-w-0 flex-1 items-center gap-2">
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

                <div className="flex shrink-0 items-center gap-2">
                    <Button variant="outline">
                        <Link href="/login">Đăng nhập</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/register">Đăng ký</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/estates/create">Đăng tin</Link>
                    </Button>
                </div>
            </nav>
        </header>
    );
}
