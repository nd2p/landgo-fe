"use client"

import { useState } from 'react'
import Link from 'next/link'
import { BedDouble, Bath, MapPin, Eye, MessageCircle, CircleDollarSign, ThumbsUp, ThumbsDown } from 'lucide-react'

import type { Estate } from '@/features/estate/estate.types'
import AuthorBadge from '@/components/estate/author-badge'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import usersData from '@/mocks/users.json'

interface EstateCardProps {
    estate: Estate
    viewMode?: 'list' | 'grid'
}

interface User {
    _id: string
    name: string
    avatar: string | null
    phone: string | null
}

const users = usersData as User[]

enum PinLevel {
    VIP = 1,
    SUPER = 2,
}

const PIN_LEVEL_LABEL: Record<PinLevel, string> = {
    [PinLevel.VIP]: 'VIP',
    [PinLevel.SUPER]: 'SUPER',
}

const STATUS_LABEL: Record<Estate['status'], string> = {
    Approved: 'Da duyet',
    Pending: 'Cho duyet',
    Rejected: 'Tu choi',
}

function formatPrice(price: number) {
    if (price >= 1_000_000_000) {
        const valueInBillions = price / 1_000_000_000
        return `${new Intl.NumberFormat('vi-VN', {
            minimumFractionDigits: valueInBillions % 1 === 0 ? 0 : 1,
            maximumFractionDigits: 1,
        }).format(valueInBillions)} tỷ`
    }

    if (price >= 1_000_000) {
        const valueInMillions = price / 1_000_000
        return `${new Intl.NumberFormat('vi-VN', {
            minimumFractionDigits: valueInMillions % 1 === 0 ? 0 : 1,
            maximumFractionDigits: 1,
        }).format(valueInMillions)} triệu`
    }

    return `${new Intl.NumberFormat('vi-VN').format(price)} VND`
}

function formatPricePerSqm(price: number, area: number) {
    if (!area) {
        return 'N/A'
    }

    const value = price / area
    return `${new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value)}/m2`
}

function getStatusVariant(status: Estate['status']) {
    if (status === 'Approved') {
        return 'success'
    }

    if (status === 'Pending') {
        return 'secondary'
    }

    return 'destructive'
}

function getPinLevelVariant(pinLevel: number | null) {
    if (pinLevel === PinLevel.VIP) {
        return 'default'
    }

    if (pinLevel === PinLevel.SUPER) {
        return 'destructive'
    }

    return undefined
}

export default function EstateCard({ estate, viewMode = 'list' }: EstateCardProps) {
    const [vote, setVote] = useState<'up' | 'down' | null>(null)
    const [upvoteCount, setUpvoteCount] = useState(estate.upvoteCount)
    const [downvoteCount, setDownvoteCount] = useState(estate.downvoteCount)

    const coverImage =
        estate.images[0] ||
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80'
    const author = users.find((user) => user._id === estate.author)
    const isLand = estate.propertyType.trim().toLowerCase() === 'land'
    const isGrid = viewMode === 'grid'

    const handleUpvote = () => {
        if (vote === 'up') {
            setVote(null)
            setUpvoteCount((prev) => Math.max(0, prev - 1))
            return
        }

        if (vote === 'down') {
            setDownvoteCount((prev) => Math.max(0, prev - 1))
        }

        setVote('up')
        setUpvoteCount((prev) => prev + 1)
    }

    const handleDownvote = () => {
        if (vote === 'down') {
            setVote(null)
            setDownvoteCount((prev) => Math.max(0, prev - 1))
            return
        }

        if (vote === 'up') {
            setUpvoteCount((prev) => Math.max(0, prev - 1))
        }

        setVote('down')
        setDownvoteCount((prev) => prev + 1)
    }

    return (
        <article
            className={`overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md ${isGrid ? 'h-full' : 'md:h-50'
                }`}
        >
            <div className={`grid gap-0 ${isGrid ? 'grid-cols-1' : 'md:h-full md:grid-cols-[300px_1fr]'}`}>
                <Link href={`/estates/${estate._id}`} className="relative block h-full overflow-hidden bg-muted">
                    <Image
                        src={coverImage}
                        alt={estate.title}
                        width={900}
                        height={350}
                        className={`w-full object-cover ${isGrid ? 'h-52' : 'h-52 md:h-full'}`}
                        unoptimized
                    />

                    {author && (
                        <div className="absolute right-0 bottom-0 left-0 z-20 p-2">
                            <AuthorBadge
                                name={author.name}
                                avatar={author.avatar}
                                updatedAt={estate.updatedAt}
                                phone={author.phone}
                            />
                        </div>
                    )}

                    {estate.pinLevel && estate.pinLevel in PIN_LEVEL_LABEL && (() => {
                        const pinVariant = getPinLevelVariant(estate.pinLevel)
                        return pinVariant ? (
                            <Badge variant={pinVariant} className="absolute top-2 left-2">
                                {PIN_LEVEL_LABEL[estate.pinLevel as PinLevel]}
                            </Badge>
                        ) : null
                    })()}
                </Link>

                <div className="flex flex-col gap-3 p-4 md:p-4">
                    <Link
                        href={`/estates/${estate._id}`}
                        className="line-clamp-2 text-xl font-bold text-red-700 hover:underline"
                    >
                        {estate.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium">
                        <span className="text-xl font-bold text-red-700">{formatPrice(estate.price)}</span>
                        <span className="text-black font-bold">{estate.area} m2</span>
                        <span className="text-black font-bold">{formatPricePerSqm(estate.price, estate.area)}</span>
                        <Badge variant="outline">{estate.propertyType}</Badge>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-blue-600">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{estate.addressDetail}</span>
                    </div>

                    <p className="line-clamp-2 text-sm text-muted-foreground">{estate.description}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        {!isLand && (
                            <>
                                <span className="inline-flex items-center gap-1">
                                    <BedDouble className="h-4 w-4" />
                                    {estate.numberOfBedrooms} PN
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Bath className="h-4 w-4" />
                                    {estate.numberOfBathrooms} WC
                                </span>
                            </>

                        )}
                        <span className="inline-flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {estate.viewCount}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {estate.commentCount}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <CircleDollarSign className="h-4 w-4" />
                            {estate.isNegotiable ? 'Có thương lượng' : 'Không thương lượng'}
                        </span>

                        <div className="ml-auto inline-flex items-center gap-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleUpvote}
                                className={`h-7 px-2 text-[11px] ${vote === 'up'
                                    ? 'border-green-600 bg-green-600 text-white hover:bg-green-600 hover:text-white'
                                    : 'text-slate-600'
                                    }`}
                                aria-label="Upvote estate"
                            >
                                <ThumbsUp className="h-3.5 w-3.5" />
                                <span>{upvoteCount}</span>
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleDownvote}
                                className={`h-7 px-2 text-[11px] ${vote === 'down'
                                    ? 'border-red-600 bg-red-600 text-white hover:bg-red-600 hover:text-white'
                                    : 'text-slate-600'
                                    }`}
                                aria-label="Downvote estate"
                            >
                                <ThumbsDown className="h-3.5 w-3.5" />
                                <span>{downvoteCount}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}