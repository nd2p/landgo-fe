import { MapPin, Share2, AlertTriangle, Heart, BedDouble, Bath, Receipt, Sofa } from "lucide-react";
import { formatPrice, formatPricePerSqm } from "@/components/estate/estate.utils";
import type { Estate } from "@/features/estate/estate.types";

export default function EstateDetailInfo({ estate }: { estate: Estate }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">
          Bán / {estate.province?.name} / {estate.district?.name} / Căn hộ chung cư tại {estate.title.split(",")[0]}
        </div>
        <h1 className="text-2xl font-bold leading-tight md:text-3xl text-gray-900">
          {estate.title}
        </h1>
        <div className="flex items-start gap-2 text-sm text-muted-foreground mt-1">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{estate.addressDetail}</span>
        </div>
      </div>

      <hr className="border-border" />

      {/* Quick Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Khoảng giá</span>
            <div className="flex items-end gap-1">
              <span className="text-xl font-bold">{formatPrice(estate.price)}</span>
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              ~{formatPricePerSqm(estate.price, estate.area)}/m²
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Diện tích</span>
            <span className="text-xl font-bold">{estate.area} m²</span>
          </div>

          {estate.numberOfBedrooms > 0 && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Phòng ngủ</span>
              <span className="text-xl font-bold">{estate.numberOfBedrooms} PN</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-muted-foreground">
          <button className="hover:text-black">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="hover:text-black">
            <AlertTriangle className="h-5 w-5" />
          </button>
          <button className="hover:text-red-500">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>

      <hr className="border-border" />

      {/* Description */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">Thông tin mô tả</h2>
        <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
          {estate.description || "Chưa có thông tin mô tả cho bất động sản này."}
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-4 mt-4">
        <h2 className="text-xl font-bold">Đặc điểm bất động sản</h2>

        {estate.propertyType?.toLowerCase() === 'land' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 border-t border-border pt-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] font-bold">đ</span>
                <span className="text-sm">Khoảng giá</span>
              </div>
              <span className="text-sm font-medium">{formatPrice(estate.price)}</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                <span className="text-sm">Mặt tiền</span>
              </div>
              <span className="text-sm font-medium">{estate.frontage ? `${estate.frontage} m` : 'Đang cập nhật'}</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-5 border-2 border-current rounded-sm relative"><div className="absolute top-0 right-0 w-2 h-full border-l-2 border-current"></div></div>
                <span className="text-sm">Diện tích</span>
              </div>
              <span className="text-sm font-medium">{estate.area} m²</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 17l6-6-6-6" /><path d="M12 19h8" /></svg>
                <span className="text-sm">Đường vào</span>
              </div>
              <span className="text-sm font-medium">{estate.entryWidth ? `${estate.entryWidth} m` : 'Đang cập nhật'}</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
                <span className="text-sm">Hướng nhà</span>
              </div>
              <span className="text-sm font-medium">{estate.direction || 'Đang cập nhật'}</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Receipt className="h-5 w-5" />
                <span className="text-sm">Pháp lý</span>
              </div>
              <span className="text-sm font-medium">{estate.legalStatus || 'Sổ đỏ/ Sổ hồng'}</span>
            </div>
          </div>
        ) : estate.propertyType?.toLowerCase() === 'apartment' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 border-t border-border pt-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] font-bold">đ</span>
                <span className="text-sm">Mức giá</span>
              </div>
              <span className="text-sm font-medium">{formatPrice(estate.price)}</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bath className="h-5 w-5" />
                <span className="text-sm">Số phòng vệ sinh</span>
              </div>
              <span className="text-sm font-medium">{estate.numberOfBathrooms} phòng</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-5 border-2 border-current rounded-sm relative"><div className="absolute top-0 right-0 w-2 h-full border-l-2 border-current"></div></div>
                <span className="text-sm">Diện tích</span>
              </div>
              <span className="text-sm font-medium">{estate.area} m²</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Receipt className="h-5 w-5" />
                <span className="text-sm">Pháp lý</span>
              </div>
              <span className="text-sm font-medium">{estate.legalStatus || 'Đang cập nhật'}</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BedDouble className="h-5 w-5" />
                <span className="text-sm">Số phòng ngủ</span>
              </div>
              <span className="text-sm font-medium">{estate.numberOfBedrooms} phòng</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                <span className="text-sm">Hướng nhà</span>
              </div>
              <span className="text-sm font-medium">{estate.direction || 'Đang cập nhật'}</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 9h2M9 13h2M9 17h2M15 9h-2M15 13h-2M15 17h-2" /></svg>
                <span className="text-sm">Tầng số</span>
              </div>
              <span className="text-sm font-medium">{estate.floorNumber ? `${estate.floorNumber}` : 'Đang cập nhật'}</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sofa className="h-5 w-5" />
                <span className="text-sm">Nội thất</span>
              </div>
              <span className="text-sm font-medium">Đang cập nhật</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 border-t border-border pt-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] font-bold">đ</span>
                <span className="text-sm">Mức giá</span>
              </div>
              <span className="text-sm font-medium">{formatPrice(estate.price)}</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bath className="h-5 w-5" />
                <span className="text-sm">Số phòng vệ sinh</span>
              </div>
              <span className="text-sm font-medium">{estate.numberOfBathrooms} phòng</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-5 border-2 border-current rounded-sm relative"><div className="absolute top-0 right-0 w-2 h-full border-l-2 border-current"></div></div>
                <span className="text-sm">Diện tích</span>
              </div>
              <span className="text-sm font-medium">{estate.area} m²</span>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Receipt className="h-5 w-5" />
                <span className="text-sm">Pháp lý</span>
              </div>
              <span className="text-sm font-medium">{estate.legalStatus || 'Đang cập nhật'}</span>
            </div>

            {estate.numberOfBedrooms > 0 && (
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BedDouble className="h-5 w-5" />
                  <span className="text-sm">Số phòng ngủ</span>
                </div>
                <span className="text-sm font-medium">{estate.numberOfBedrooms} phòng</span>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sofa className="h-5 w-5" />
                <span className="text-sm">Nội thất</span>
              </div>
              <span className="text-sm font-medium">Đang cập nhật</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
