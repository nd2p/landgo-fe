"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '../ui/button'
import { GetPostsParams } from '@/features/estate/estate.types'
import {
    AREA_MAX,
    AREA_MIN,
    AREA_STEP,
    PRICE_MAX,
    PRICE_MIN,
    PRICE_STEP,
    clamp,
    formatPriceDisplay,
    parseAreaPreset,
    parsePricePreset,
} from '@/components/estate/estate.utils'

interface EstateFilterProps {
    onApply?: (filters: GetPostsParams) => void
}

const propertyTypeOptions = [
    { value: 'all', label: 'Loại nhà đất' },
    { value: 'apartment', label: 'Căn hộ' },
    { value: 'house', label: 'Nhà riêng' },
    { value: 'land', label: 'Đất nền' },
    { value: 'villa', label: 'Biệt thự' },
]

const priceOptions = [
    { value: 'all', label: 'Tất cả khoảng giá' },
    { value: 'under-500', label: 'Dưới 500 triệu' },
    { value: '500-800', label: '500 - 800 triệu' },
    { value: '800-1000', label: '800 - 1 tỷ' },
    { value: '1-2', label: '1 - 2 tỷ' },
    { value: '2-3', label: '2 - 3 tỷ' },
    { value: '3-5', label: '3 - 5 tỷ' },
    { value: '5-7', label: '5 - 7 tỷ' },
    { value: '7-10', label: '7 - 10 tỷ' },
    { value: '10-20', label: '10 - 20 tỷ' },
    { value: '20-30', label: '20 - 30 tỷ' },
    { value: '30-40', label: '30 - 40 tỷ' },
    { value: '40-60', label: '40 - 60 tỷ' },
    { value: 'over-60', label: 'Trên 60 tỷ' },
]


const areaOptions = [
    { value: 'all', label: 'Diện tích' },
    { value: 'under-30', label: 'Dưới 30 m2' },
    { value: '30-50', label: '30 - 50 m2' },
    { value: '50-80', label: '50 - 80 m2' },
    { value: '80-100', label: '80 - 100 m2' },
    { value: '100-150', label: '100 - 150 m2' },
    { value: '150-200', label: '150 - 200 m2' },
    { value: '200-250', label: '200 - 250 m2' },
    { value: '250-300', label: '250 - 300 m2' },
    { value: '300-350', label: '300 - 350 m2' },
    { value: '350-400', label: '350 - 400 m2' },
    { value: '400-450', label: '400 - 450 m2' },
    { value: '450-500', label: '450 - 500 m2' },
    { value: 'over-500', label: 'Trên 500 m2' },
]

export default function EstateFilter({ onApply }: EstateFilterProps) {
    const [propertyType, setPropertyType] = useState('all')
    const [openPriceFilter, setOpenPriceFilter] = useState(false)
    const [selectedPricePreset, setSelectedPricePreset] = useState('all')
    const [minPrice, setMinPrice] = useState(PRICE_MIN)
    const [maxPrice, setMaxPrice] = useState(PRICE_MAX)
    const priceFilterRef = useRef<HTMLDivElement>(null)

    const [openAreaFilter, setOpenAreaFilter] = useState(false)
    const [selectedAreaPreset, setSelectedAreaPreset] = useState('all')
    const [minArea, setMinArea] = useState(AREA_MIN)
    const [maxArea, setMaxArea] = useState(AREA_MAX)
    const areaFilterRef = useRef<HTMLDivElement>(null)

    const minPercent = useMemo(() => ((minArea - AREA_MIN) / (AREA_MAX - AREA_MIN)) * 100, [minArea])
    const maxPercent = useMemo(() => ((maxArea - AREA_MIN) / (AREA_MAX - AREA_MIN)) * 100, [maxArea])
    const minPricePercent = useMemo(
        () => ((minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100,
        [minPrice]
    )
    const maxPricePercent = useMemo(
        () => ((maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100,
        [maxPrice]
    )

    const selectedPriceLabel = useMemo(() => {
        if (selectedPricePreset !== 'custom') {
            return priceOptions.find((option) => option.value === selectedPricePreset)?.label ?? 'Khoảng giá'
        }

        return `${formatPriceDisplay(minPrice)} - ${formatPriceDisplay(maxPrice)}`
    }, [maxPrice, minPrice, selectedPricePreset])

    const selectedAreaLabel = useMemo(() => {
        if (selectedAreaPreset !== 'custom') {
            return areaOptions.find((option) => option.value === selectedAreaPreset)?.label ?? 'Diện tích'
        }

        return `${minArea} - ${maxArea} m2`
    }, [maxArea, minArea, selectedAreaPreset])

    useEffect(() => {
        if (!openAreaFilter && !openPriceFilter) {
            return
        }

        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node
            const clickedOutsideArea = !areaFilterRef.current?.contains(target)
            const clickedOutsidePrice = !priceFilterRef.current?.contains(target)

            if (clickedOutsideArea && clickedOutsidePrice) {
                setOpenPriceFilter(false)
                setOpenAreaFilter(false)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [openAreaFilter, openPriceFilter])

    const handlePricePresetChange = (value: string) => {
        setSelectedPricePreset(value)

        const range = parsePricePreset(value)
        setMinPrice(range.min)
        setMaxPrice(range.max)
    }

    const handleMinPriceInput = (value: number) => {
        const nextMin = clamp(value, PRICE_MIN, maxPrice - PRICE_STEP)
        setMinPrice(nextMin)
        setSelectedPricePreset('custom')
    }

    const handleMaxPriceInput = (value: number) => {
        const nextMax = clamp(value, minPrice + PRICE_STEP, PRICE_MAX)
        setMaxPrice(nextMax)
        setSelectedPricePreset('custom')
    }

    const handlePresetChange = (value: string) => {
        const range = parseAreaPreset(value)

        setSelectedAreaPreset(value)
        setMinArea(range.min)
        setMaxArea(range.max)
    }

    const handleMinInput = (value: number) => {
        const nextMin = clamp(value, AREA_MIN, maxArea - AREA_STEP)
        setMinArea(nextMin)
        setSelectedAreaPreset('custom')
    }

    const handleMaxInput = (value: number) => {
        const nextMax = clamp(value, minArea + AREA_STEP, AREA_MAX)
        setMaxArea(nextMax)
        setSelectedAreaPreset('custom')
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />

            <Select value={propertyType} onValueChange={setPropertyType}>
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

            <div className="relative" ref={priceFilterRef}>
                <button
                    type="button"
                    onClick={() => {
                        setOpenAreaFilter(false)
                        setOpenPriceFilter((prev) => !prev)
                    }}
                    className="flex h-10 min-w-50 items-center justify-between gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-500 shadow-none transition hover:bg-slate-50"
                >
                    <span>{selectedPriceLabel}</span>
                    <ChevronDown className="h-4 w-4" />
                </button>

                {openPriceFilter && (
                    <div className="absolute left-0 top-12 z-50 w-85 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                            <div>
                                <p className="mb-1 text-sm font-medium text-slate-700">Giá nhỏ nhất (tỷ)</p>
                                <input
                                    type="number"
                                    min={PRICE_MIN}
                                    max={maxPrice - PRICE_STEP}
                                    step={PRICE_STEP}
                                    value={minPrice}
                                    onChange={(event) => handleMinPriceInput(Number(event.target.value))}
                                    className="h-9 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"
                                />
                            </div>

                            <span className="pt-5 text-lg text-slate-500">→</span>

                            <div>
                                <p className="mb-1 text-sm font-medium text-slate-700">Giá lớn nhất (tỷ)</p>
                                <input
                                    type="number"
                                    min={minPrice + PRICE_STEP}
                                    max={PRICE_MAX}
                                    step={PRICE_STEP}
                                    value={maxPrice}
                                    onChange={(event) => handleMaxPriceInput(Number(event.target.value))}
                                    className="h-9 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"
                                />
                            </div>
                        </div>

                        <div className="relative mt-4 h-8">
                            <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-slate-200" />
                            <div
                                className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-amber-500"
                                style={{ left: `${minPricePercent}%`, right: `${100 - maxPricePercent}%` }}
                            />

                            <input
                                type="range"
                                min={PRICE_MIN}
                                max={PRICE_MAX}
                                step={PRICE_STEP}
                                value={minPrice}
                                onChange={(event) => handleMinPriceInput(Number(event.target.value))}
                                className="pointer-events-none absolute inset-0 h-8 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-amber-600 [&::-webkit-slider-thumb]:bg-amber-600"
                            />

                            <input
                                type="range"
                                min={PRICE_MIN}
                                max={PRICE_MAX}
                                step={PRICE_STEP}
                                value={maxPrice}
                                onChange={(event) => handleMaxPriceInput(Number(event.target.value))}
                                className="pointer-events-none absolute inset-0 h-8 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-amber-600 [&::-webkit-slider-thumb]:bg-amber-600"
                            />
                        </div>

                        <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
                            {priceOptions.map((option) => {
                                const isSelected = selectedPricePreset === option.value

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handlePricePresetChange(option.value)}
                                        className="flex w-full items-center justify-between text-sm text-slate-700"
                                    >
                                        <span>{option.label}</span>
                                        <span
                                            className={`flex h-4 w-4 items-center justify-center rounded-full border ${isSelected ? 'border-rose-500' : 'border-slate-300'}`}
                                        >
                                            {isSelected && <span className="h-2 w-2 rounded-full bg-rose-500" />}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="relative" ref={areaFilterRef}>
                <button
                    type="button"
                    onClick={() => {
                        setOpenPriceFilter(false)
                        setOpenAreaFilter((prev) => !prev)
                    }}
                    className="flex h-10 min-w-50 items-center justify-between gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-500 shadow-none transition hover:bg-slate-50"
                >
                    <span>{selectedAreaLabel}</span>
                    <ChevronDown className="h-4 w-4" />
                </button>

                {openAreaFilter && (
                    <div className="absolute left-0 top-12 z-50 w-85 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                            <div>
                                <p className="mb-1 text-sm font-medium text-slate-700">Diện tích nhỏ nhất</p>
                                <input
                                    type="number"
                                    min={AREA_MIN}
                                    max={maxArea - AREA_STEP}
                                    value={minArea}
                                    onChange={(event) => handleMinInput(Number(event.target.value))}
                                    className="h-9 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"
                                />
                            </div>

                            <span className="pt-5 text-lg text-slate-500">→</span>

                            <div>
                                <p className="mb-1 text-sm font-medium text-slate-700">Diện tích lớn nhất</p>
                                <input
                                    type="number"
                                    min={minArea + AREA_STEP}
                                    max={AREA_MAX}
                                    value={maxArea}
                                    onChange={(event) => handleMaxInput(Number(event.target.value))}
                                    className="h-9 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-slate-400"
                                />
                            </div>
                        </div>

                        <div className="relative mt-4 h-8">
                            <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-slate-200" />
                            <div
                                className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-amber-500"
                                style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                            />

                            <input
                                type="range"
                                min={AREA_MIN}
                                max={AREA_MAX}
                                step={AREA_STEP}
                                value={minArea}
                                onChange={(event) => handleMinInput(Number(event.target.value))}
                                className="pointer-events-none absolute inset-0 h-8 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-amber-600 [&::-webkit-slider-thumb]:bg-amber-600"
                            />

                            <input
                                type="range"
                                min={AREA_MIN}
                                max={AREA_MAX}
                                step={AREA_STEP}
                                value={maxArea}
                                onChange={(event) => handleMaxInput(Number(event.target.value))}
                                className="pointer-events-none absolute inset-0 h-8 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-amber-600 [&::-webkit-slider-thumb]:bg-amber-600"
                            />

                        </div>

                        <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
                            {areaOptions.map((option) => {
                                const isSelected = selectedAreaPreset === option.value

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handlePresetChange(option.value)}
                                        className="flex w-full items-center justify-between text-sm text-slate-700"
                                    >
                                        <span>{option.value === 'all' ? 'Tất cả diện tích' : option.label}</span>
                                        <span
                                            className={`flex h-4 w-4 items-center justify-center rounded-full border ${isSelected ? 'border-rose-500' : 'border-slate-300'}`}
                                        >
                                            {isSelected && <span className="h-2 w-2 rounded-full bg-rose-500" />}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            <Button
                type="button"
                onClick={() => {
                    onApply?.({
                        propertyType: propertyType !== 'all' ? propertyType : undefined,
                        minPrice: selectedPricePreset !== 'all' ? minPrice : undefined,
                        maxPrice: selectedPricePreset !== 'all' ? maxPrice : undefined,
                        minArea: selectedAreaPreset !== 'all' ? minArea : undefined,
                        maxArea: selectedAreaPreset !== 'all' ? maxArea : undefined,
                    })
                    setOpenPriceFilter(false)
                    setOpenAreaFilter(false)
                }}
                variant="default"
            >
                Áp dụng
            </Button>
        </div>
    )
}