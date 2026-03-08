"use client"

import { useEffect, useState } from 'react'
import { List, LayoutGrid } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

import EstateCard from '@/components/estate/estate-card'
import EstateFilter from '@/components/estate/estate-filter'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { getPosts } from '@/features/estate/estate.api'
import { Estate, GetPostsParams, type EstateCardViewMode } from '@/features/estate/estate.types'

function formatTotal(total: number) {
    return new Intl.NumberFormat('vi-VN').format(total)
}

export default function EstatesPage() {
    const searchParams = useSearchParams()
    const [viewMode, setViewMode] = useState<EstateCardViewMode>('list')
    const [estates, setEstates] = useState<Estate[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchPosts = async (filters: GetPostsParams = {}) => {
        setIsLoading(true)
        try {
            const posts = await getPosts(filters)
            setEstates(posts)
        } catch (error) {
            console.log(error);
            setEstates([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleApplyFilters = (filters: GetPostsParams) => {
        void fetchPosts(filters)
    }

    useEffect(() => {
        const urlFilters: GetPostsParams = {
            province: searchParams.get('province') ?? undefined,
            district: searchParams.get('district') ?? undefined,
            ward: searchParams.get('ward') ?? undefined,
            addressDetail: searchParams.get('addressDetail') ?? undefined,
        }

        void fetchPosts(urlFilters)
    }, [searchParams])

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8 mb-20">
            <div className="mb-4 space-y-2">
                <p className="text-sm text-slate-600">Bán / Tất cả BĐS trên toàn quốc</p>
                <h1 className="text-2xl leading-tight font-bold tracking-tight text-slate-900 md:text-3xl">
                    Mua bán nhà đất trên toàn quốc
                </h1>
                <p className="text-sm text-slate-600">
                    Hiện có <span className="font-semibold">{formatTotal(estates.length)}</span> bất động sản.
                </p>
            </div>

            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <EstateFilter onApply={handleApplyFilters} />

                <div className="inline-flex items-center gap-1 self-start rounded-md border border-slate-300 bg-white p-1 lg:self-auto">
                    <Button
                        type="button"
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="h-8 px-2"
                        aria-label="Xem dang danh sach"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="h-8 px-2"
                        aria-label="Xem dang luoi"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
                    <Loading
                        label="Đang tải danh sách bất động sản..."
                        fullScreen={false}
                        className="min-h-[40vh] items-center justify-center"
                    />
                </main>
            ) : (
                <section className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
                    {estates.map((estate) => (
                        <EstateCard key={estate._id} estate={estate} viewMode={viewMode} />
                    ))}
                </section>
            )}
        </main>
    )
}
