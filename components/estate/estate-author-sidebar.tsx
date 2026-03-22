"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Estate, AuthorObject } from "@/features/estate/estate.types";

interface EstateAuthorSidebarProps {
  author?: AuthorObject;
  estate: Estate;
}

export default function EstateAuthorSidebar({ author, estate }: EstateAuthorSidebarProps) {
  const [showPhone, setShowPhone] = useState(false);

  if (!author) {
    return null;
  }

  const avatar = author.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(author.name) + "&background=random";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border">
          <Image src={avatar} alt={author.name} fill className="object-cover" unoptimized />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">{author.name}</span>
          <span className="text-xs text-muted-foreground hover:underline cursor-pointer">
            Xem thêm tin khác
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="outline" className="w-full justify-center gap-2" onClick={() => window.open(`https://zalo.me/${author.phone}`, '_blank')}>
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/3840px-Icon_of_Zalo.svg.png"
            alt="Zalo"
            width={20}
            height={20}
            className="h-5 w-5"
            unoptimized
          />
          Chat qua Zalo
        </Button>
        <Button
          className="w-full justify-center gap-2"
          onClick={(e) => {
            if (!author.phone) return;
            if (!showPhone) {
              setShowPhone(true);
              navigator.clipboard.writeText(author.phone);
            }
          }}
          asChild={showPhone}
        >
          {showPhone ? (
            <a href={`tel:${author.phone}`}>
              {author.phone} · Đã sao chép
            </a>
          ) : (
            <div className="flex items-center gap-2 cursor-pointer">
              <Phone className="h-4 w-4" />
              {author.phone ? `${author.phone.slice(0, 4)} *** · Hiện số` : 'Liên hệ'}
            </div>
          )}
        </Button>
      </div>

      {estate.isNegotiable && (
        <div className="mt-2 text-center text-xs text-muted-foreground">
          Chủ nhà đồng ý thương lượng
        </div>
      )}
    </div>
  );
}
