import { Input } from "@/components/ui/input";
import VipPriceBox from "./vip-price-box";

export default function PostTypeSection() {
  return (
    <section className="space-y-4">
      <h3 className="font-semibold text-[#8b5a00]">Hình thức đăng tin</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Tin thường */}
        <div className="border rounded-md p-4 space-y-3">
          <label className="flex items-center gap-2">
            <Input type="radio" name="postType" value="normal" />
            <span className="font-medium">Tin thường</span>
          </label>
          <ul className="text-sm text-gray-600 list-disc ml-6">
            <li>Miễn phí, không giới hạn số lượng tin.</li>
            <li>
              Tiêu đề <b className="text-[#8b5a00]">màu vàng nâu</b>, nằm dưới
              tin VIP.
            </li>
            <li>Hiển thị 60 ngày.</li>
          </ul>
        </div>

        {/* Tin VIP */}
        <div className="border rounded-md p-4 space-y-3">
          <label className="flex items-center gap-2">
            <Input type="radio" name="postType" value="vip" />
            <span className="font-medium text-destructive">Tin VIP</span>
          </label>

          <VipPriceBox />

          <ul className="text-sm text-gray-600 list-disc ml-6">
            <li>
              Tiêu đề <b className="text-destructive">màu đỏ đậm</b> kèm ★
            </li>
            <li>VIP 5★ hiển thị trên cùng</li>
            <li>Hiệu quả cao gấp 10-30 lần</li>
          </ul>
        </div>
      </div>
    </section>
  );
}