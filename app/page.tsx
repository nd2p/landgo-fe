"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Building2, House, MapPinned } from 'lucide-react'

import EstateCard from '@/components/estate/estate-card'
import { Loading } from '@/components/ui/loading'
import { getPosts } from '@/features/estate/estate.api'
import type { Estate } from '@/features/estate/estate.types'

const quickCategories = [
  {
    title: 'Mua Bán Căn Hộ',
    description: 'Tập trung khu vực trung tâm và các dự án mới bàn giao.',
    href: '/estates',
    icon: Building2,
  },
  {
    title: 'Đất Nền Tiềm Năng',
    description: 'Lọc theo pháp lý, quy hoạch và biên độ tăng giá.',
    href: '/estates',
    icon: MapPinned,
  },
  {
    title: 'Ký Gửi Chính Chủ',
    description: 'Đăng tin nhanh, duyệt chuẩn, tối ưu khả năng chốt giao dịch.',
    href: '/estates/create',
    icon: House,
  },
]

export default function HomePage() {
  const [estates, setEstates] = useState<Estate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchPosts = async () => {
      try {
        const posts = await getPosts()

        if (isMounted) {
          setEstates(posts)
        }
      } catch {
        if (isMounted) {
          setEstates([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchPosts()

    return () => {
      isMounted = false
    }
  }, [])

  const highlightedEstates = useMemo(
    () => estates.filter((estate) => estate.pinLevel === 2).slice(0, 3),
    [estates]
  )

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_12%_18%,#fef3c7_0%,transparent_38%),radial-gradient(circle_at_92%_15%,#bfdbfe_0%,transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <p className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wide text-amber-800">
            SÀN THƯƠNG MẠI BẤT ĐỘNG SẢN LANDGO
          </p>

          <h1 className="mt-4 max-w-3xl text-3xl leading-tight font-bold tracking-tight text-slate-900 md:text-5xl">
            Kết nối người mua và người bán bất động sản nhanh, minh bạch, đúng nhu cầu
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
            Tìm tin đăng đã xác thực, so sánh giá theo khu vực, và đăng tin ký gửi trên một nền tảng
            duy nhất. LandGo tối ưu từ tìm kiếm đến chốt giao dịch.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/estates"
              className="inline-flex h-10 items-center rounded-md bg-amber-500 px-4 text-sm font-semibold text-black transition hover:bg-amber-400"
            >
              Khám phá tin đăng
            </Link>
            <Link
              href="/estates/create"
              className="inline-flex h-10 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Đăng tin ngay
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 backdrop-blur">
              <p className="text-xl font-bold text-slate-900">{estates.length}+</p>
              <p className="mt-1 text-xs text-slate-600">Tin đăng đang hoạt động</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 backdrop-blur">
              <p className="text-xl font-bold text-slate-900">12 tỉnh/thành</p>
              <p className="mt-1 text-xs text-slate-600">Phủ sóng nguồn hàng đa dạng</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white/85 p-4 backdrop-blur">
              <p className="text-xl font-bold text-slate-900">98% hộ sơ</p>
              <p className="mt-1 text-xs text-slate-600">Thông tin liên hệ xác thực</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Danh mục quan tâm</h2>
          <Link href="/search" className="text-sm font-semibold text-amber-700 hover:underline">
            Tìm kiếm nâng cao
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {quickCategories.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
              >
                <span className="inline-flex rounded-md bg-amber-100 p-2 text-amber-700">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-3 text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 md:px-6 md:pb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Tin nổi bật</h2>
          <Link href="/estates" className="text-sm font-semibold text-amber-700 hover:underline">
            Xem tất cả
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-slate-50">
            <section className="mx-auto max-w-6xl py-10 md:py-12">
              <Loading
                label="Đang tải dữ liệu..."
                fullScreen={false}
                className="items-center justify-center"
              />
            </section>
          </div>
        ) : (
          <div className="space-y-4">
            {highlightedEstates.map((estate) => (
              <EstateCard key={estate._id} estate={estate} viewMode="list" />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
