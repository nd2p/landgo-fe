"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Locate } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import {
    getDistrictsService,
    getProvinceService,
    getWardsService,
} from "@/features/location/location.service";
import { IDistrict, IProvince, IWard } from "@/features/location/location.type";

export default function FilterDropdown() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [street, setStreet] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const skipNextPathResetRef = useRef(false);
    const searchQueryKey = searchParams.toString();

    const [provinces, setProvinces] = useState<IProvince[]>([]);
    const [districts, setDistricts] = useState<IDistrict[]>([]);
    const [wards, setWards] = useState<IWard[]>([]);
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
    const [isLoadingWards, setIsLoadingWards] = useState(false);

    const provinceName = useMemo(
        () => provinces.find((prov) => prov.code === province)?.name ?? "",
        [province, provinces]
    );
    const districtName = useMemo(
        () => districts.find((dist) => dist.code === district)?.name ?? "",
        [district, districts]
    );
    const wardName = useMemo(
        () => wards.find((w) => w.code === ward)?.name ?? "",
        [ward, wards]
    );

    useEffect(() => {
        const fetchProvinces = async () => {
            setIsLoadingProvinces(true);
            try {
                const data = await getProvinceService();
                setProvinces(data);
            } catch (error) {
                console.error(error);
                setProvinces([]);
            } finally {
                setIsLoadingProvinces(false);
            }
        };

        fetchProvinces();
    }, []);

    const fetchDistricts = async (provinceId: string) => {
        if (!provinceId) {
            setDistricts([]);
            return;
        }

        setIsLoadingDistricts(true);
        try {
            const data = await getDistrictsService(provinceId);
            setDistricts(data);
        } catch (error) {
            console.error(error);
            setDistricts([]);
        } finally {
            setIsLoadingDistricts(false);
        }
    };

    const fetchWards = async (districtId: string) => {
        if (!districtId) {
            setWards([]);
            return;
        }

        setIsLoadingWards(true);
        try {
            const data = await getWardsService(districtId);
            setWards(data);
        } catch (error) {
            console.error(error);
            setWards([]);
        } finally {
            setIsLoadingWards(false);
        }
    };

    const filterButtonLabel = useMemo(() => {
        const streetName = street.trim();

        if (streetName) {
            return [streetName, districtName, provinceName].filter(Boolean).join(", ");
        }

        if (wardName) {
            return [wardName, districtName, provinceName].filter(Boolean).join(", ");
        }

        if (districtName) {
            return [districtName, provinceName].filter(Boolean).join(", ");
        }

        if (provinceName) {
            return provinceName;
        }

        return "Bộ lọc";
    }, [districtName, provinceName, street, wardName]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const targetElement = target as Element | null;
            if (targetElement?.closest('[data-slot="select-content"]')) {
                return;
            }

            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (skipNextPathResetRef.current) {
            skipNextPathResetRef.current = false;
            return;
        }

        setIsOpen(false);
        setProvince("");
        setDistrict("");
        setWard("");
        setStreet("");
    }, [pathname, searchQueryKey]);

    const handleProvinceChange = (value: string) => {
        setProvince(value);
        setDistrict("");
        setWard("");
        setDistricts([]);
        setWards([]);

        const selectedProvince = provinces.find((item) => item.code === value);
        fetchDistricts(selectedProvince?._id ?? "");
    };

    const handleDistrictChange = (value: string) => {
        setDistrict(value);
        setWard("");
        setWards([]);

        const selectedDistrict = districts.find((item) => item.code === value);
        fetchWards(selectedDistrict?._id ?? "");
    };

    const handleSearch = async () => {
        setIsSearching(true);
        try {
            // Build search params
            const params = new URLSearchParams();
            const selectedProvince = provinces.find((item) => item.code === province);
            const selectedDistrict = districts.find((item) => item.code === district);
            const selectedWard = wards.find((item) => item.code === ward);

            if (selectedProvince?._id) params.append("province", selectedProvince._id);
            if (selectedDistrict?._id) params.append("district", selectedDistrict._id);
            if (selectedWard?._id) params.append("ward", selectedWard._id);
            if (street.trim()) params.append("addressDetail", street.trim());

            // Redirect to search or estates page with filters
            const searchQuery = params.toString();
            skipNextPathResetRef.current = true;

            if (searchQuery) {
                router.push(`/estates?${searchQuery}`);
            } else {
                router.push("/estates");
            }

            setIsOpen(false);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="outline"
                className="gap-2"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open filter"
            >
                <Locate className="h-4 w-4" />
                <span className="max-w-52 truncate text-left">{filterButtonLabel}</span>
                <ChevronDown className="h-4 w-4" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-96 rounded-md border bg-card p-4 shadow-lg">
                    <div className="space-y-4">
                        {/* Province Select */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Tỉnh / Thành phố
                            </label>
                            <Select value={province} onValueChange={handleProvinceChange}>
                                <SelectTrigger
                                    disabled={isLoadingProvinces}
                                    className="w-full"
                                    aria-label="Select province"
                                >
                                    <SelectValue placeholder="Chọn tỉnh / thành phố" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {provinces.map((prov) => (
                                            <SelectItem
                                                key={prov.code}
                                                value={prov.code}
                                            >
                                                {prov.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* District Select */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Quận / Huyện
                            </label>
                            <Select
                                value={district}
                                onValueChange={handleDistrictChange}
                                disabled={!province}
                            >
                                <SelectTrigger
                                    disabled={!province || isLoadingDistricts}
                                    className="w-full"
                                    aria-label="Select district"
                                >
                                    <SelectValue placeholder="Chọn quận / huyện" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {districts.map((dist) => (
                                            <SelectItem
                                                key={dist.code}
                                                value={dist.code}
                                            >
                                                {dist.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Ward Select */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Xã / Phường
                            </label>
                            <Select value={ward} onValueChange={setWard} disabled={!district}>
                                <SelectTrigger
                                    disabled={!district || isLoadingWards}
                                    className="w-full"
                                    aria-label="Select ward"
                                >
                                    <SelectValue placeholder="Chọn xã / phường" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {wards.map((w) => (
                                            <SelectItem key={w.code} value={w.code}>
                                                {w.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Street Input */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">Đường</label>
                            <input
                                type="text"
                                placeholder="Nhập tên đường"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                aria-label="Enter street name"
                            />
                        </div>

                        {/* Search Button */}
                        <Button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="w-full"
                        >
                            {isSearching ? "Đang tìm..." : "Tìm"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
