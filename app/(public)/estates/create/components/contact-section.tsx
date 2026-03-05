import { Input } from "@/components/ui/input";

export default function ContactSection() {
  return (
    <section className="space-y-4">
      <h3 className="font-semibold text-[#8b5a00]">Liên hệ người đăng</h3>

      <label className="flex items-center gap-2">
        <Input type="radio" name="contact" />
        Chính chủ
      </label>

      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Số điện thoại" />
        <Input placeholder="Họ tên" />
      </div>
    </section>
  );
}