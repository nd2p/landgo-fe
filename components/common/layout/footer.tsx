'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50">
            <div className="mx-auto max-w-6xl px-4">
                <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo-landgo.png"
                                alt="LandGo Logo"
                                width={80}
                                height={40}
                                className="h-10 w-auto"
                            />
                        </div>

                        {/* Hotline */}
                        <div className="flex items-start gap-3">
                            <Phone className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
                            <div>
                                <p className="text-xs text-slate-600">Hotline</p>
                                <p className="font-semibold text-slate-900">1900 1881</p>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="flex items-start gap-3">
                            <Mail className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
                            <div>
                                <p className="text-xs text-slate-600">Hỗ trợ khách hàng</p>
                                <p className="text-sm font-medium text-slate-900">hogiup.landgo.com.vn</p>
                            </div>
                        </div>

                        {/* Care */}
                        <div className="flex items-start gap-3">
                            <Mail className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
                            <div>
                                <p className="text-xs text-slate-600">Chăm sóc khách hàng</p>
                                <p className="text-sm font-medium text-slate-900">hotro@landgo.com.vn</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                    {/* Column 1 - Company Info */}
                    <div>
                        <h3 className="mb-4 text-sm font-bold tracking-wide text-slate-900">CÔNG TY CỔ PHẦN LANDGO VIỆT NAM</h3>
                        <div className="space-y-3 text-sm text-slate-600">
                            <div className="flex gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                <p>Tầng 31, Tòa nhà Landmark 81, Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
                            </div>
                            <div className="flex gap-2">
                                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                <p>(028) 3562 5939 - (028) 3562 5940</p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2 - Guidance */}
                    <div>
                        <h3 className="mb-4 text-sm font-bold tracking-wide text-slate-900">HƯỚNG DẪN</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>
                                <Link href="#" className="transition hover:text-amber-600">
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="transition hover:text-amber-600">
                                    Báo giá và hỗ trợ
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="transition hover:text-amber-600">
                                    Câu hỏi thường gặp
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="transition hover:text-amber-600">
                                    Góp ý báo lỗi
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="transition hover:text-amber-600">
                                    Sitemap
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 - Policy */}
                    <div>
                        <h3 className="mb-4 text-sm font-bold tracking-wide text-slate-900">QUY ĐỊNH</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>
                                <Link href="#" className="transition hover:text-amber-600">
                                    Quy định đăng tin
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="transition hover:text-amber-600">
                                    Quy chế hoạt động
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="transition hover:text-amber-600">
                                    Điều khoản thỏa thuận
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="transition hover:text-amber-600">
                                    Chính sách bảo mật
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="transition hover:text-amber-600">
                                    Giải quyết khiếu nại
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4 - Newsletter */}
                    <div>
                        <h3 className="mb-4 text-sm font-bold tracking-wide text-slate-900">ĐĂNG KÝ NHẬN TIN</h3>
                        <p className="mb-4 text-sm text-slate-600">Nhận thông báo về các tin đăng mới hàng ngày</p>

                        <div className="mb-6 flex gap-2">
                            <Input
                                type="email"
                                placeholder="Nhập email của bạn"
                                className="h-10 flex-1 border-slate-300 text-sm"
                            />
                            <Button
                                size="icon"
                                className="h-10 w-10 bg-red-500 hover:bg-red-600"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl py-6 text-center">
                <p className="text-xs text-slate-600">
                    © 2024-2026 LandGo. Tất cả quyền được bảo lưu.
                </p>
            </div>
        </footer>
    )
}
