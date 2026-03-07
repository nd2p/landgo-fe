import Image from 'next/image'

interface AuthorBadgeProps {
    name: string
    avatar: string | null
    updatedAt: string
    phone: string | null
    className?: string
}

function maskPhone(phone: string | null) {
    if (!phone) {
        return '***'
    }

    if (phone.length <= 3) {
        return '***'
    }

    return `${phone.slice(0, -3)}***`
}

function formatRelativeTime(updatedAt: string) {
    const updatedAtTime = new Date(updatedAt).getTime()

    if (Number.isNaN(updatedAtTime)) {
        return 'vừa xong'
    }

    const now = Date.now()
    const diffMs = Math.max(0, now - updatedAtTime)
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMinutes < 1) {
        return 'vừa xong'
    }

    if (diffMinutes < 60) {
        return `${diffMinutes} phút trước`
    }

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) {
        return `${diffHours} giờ trước`
    }

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} ngày trước`
}

export default function AuthorBadge({ name, avatar, updatedAt, phone, className }: AuthorBadgeProps) {
    const displayTime = formatRelativeTime(updatedAt)
    const displayPhone = maskPhone(phone)

    return (
        <aside className={`inline-block max-w-full ${className ?? ''}`.trim()}>
            <div className="relative inline-flex items-center gap-1.5 rounded-full bg-white/75 py-0.5 pr-2 pl-0.5 shadow-[0_5px_10px_rgba(15,23,42,0.14)]">
                <Image
                    src={avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=LandGo'}
                    alt={name}
                    width={28}
                    height={28}
                    className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-white"
                    unoptimized
                />

                <div className="min-w-0">
                    <p className="truncate text-xs leading-tight font-semibold text-slate-700">{name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] leading-tight">
                        <span className="italic text-slate-600">{displayTime}</span>
                        <span className="text-slate-500">•</span>
                        <span className="font-semibold text-slate-900">{displayPhone}</span>
                    </p>
                </div>
            </div>
        </aside>
    )
}
