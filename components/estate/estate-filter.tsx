"use client"

import { SlidersHorizontal } from 'lucide-react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const propertyTypeOptions = [
    { value: 'all', label: 'Loại nhà đất' },
    { value: 'apartment', label: 'Căn hộ' },
    { value: 'house', label: 'Nhà riêng' },
    { value: 'land', label: 'Đất nền' },
]

const priceOptions = [
    { value: 'all', label: 'Khoảng giá' },
    { value: 'under-1', label: 'Dưới 1 tỷ' },
    { value: '1-3', label: '1 - 3 tỷ' },
    { value: 'over-3', label: 'Trên 3 tỷ' },
]

const areaOptions = [
    { value: 'all', label: 'Diện tích' },
    { value: 'under-50', label: 'Dưới 50 m2' },
    { value: '50-100', label: '50 - 100 m2' },
    { value: 'over-100', label: 'Trên 100 m2' },
]

export default function EstateFilter() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />

            <Select defaultValue="all">
                <SelectTrigger className="h-10 min-w-50 rounded-md border-slate-300 bg-white text-slate-500 shadow-none hover:bg-slate-50">
                    <SelectValue placeholder="Loại nhà đất" />
                </SelectTrigger>
                <SelectContent>
                    {propertyTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select defaultValue="all">
                <SelectTrigger className="h-10 min-w-50 rounded-md border-slate-300 bg-white text-slate-500 shadow-none hover:bg-slate-50">
                    <SelectValue placeholder="Khoảng giá" />
                </SelectTrigger>
                <SelectContent>
                    {priceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select defaultValue="all">
                <SelectTrigger className="h-10 min-w-50 rounded-md border-slate-300 bg-white text-slate-500 shadow-none hover:bg-slate-50">
                    <SelectValue placeholder="Diện tích" />
                </SelectTrigger>
                <SelectContent>
                    {areaOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}