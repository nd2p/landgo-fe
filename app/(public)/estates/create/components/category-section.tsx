import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategorySection() {
  return (
    <section className="space-y-4">
      <h3 className="font-semibold text-[#8b5a00]">
        Loại & Danh mục BĐS <span className="text-red-500">*</span>
      </h3>

      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Chọn danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="house">Nhà riêng</SelectItem>
          <SelectItem value="land">Đất</SelectItem>
          <SelectItem value="apartment">Căn hộ chung cư</SelectItem>
          <SelectItem value="warehouse">Kho, nhà xưởng</SelectItem>
          <SelectItem value="office">Văn phòng</SelectItem>
        </SelectContent>
      </Select>
    </section>
  );
}