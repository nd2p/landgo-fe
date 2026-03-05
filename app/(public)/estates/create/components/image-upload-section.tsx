import { Button } from "@/components/ui/button";

export default function ImageUploadSection() {
  return (
    <section className="space-y-4">
      <h3 className="font-semibold text-[#8b5a00]">
        Hình ảnh BĐS <span className="text-red-500">*</span>
      </h3>

      <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center text-gray-400">
        Kéo thả hoặc thêm ảnh
      </div>

      <Button variant="outline">+ Thêm ảnh</Button>
    </section>
  );
}