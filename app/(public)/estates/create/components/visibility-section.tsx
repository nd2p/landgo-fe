import { Input } from "@/components/ui/input";

export default function VisibilitySection() {
  return (
    <section className="space-y-4">
      <h3 className="font-semibold text-[#8b5a00]">Chế độ hiển thị</h3>

      <div className="space-y-3">
        {["Đăng công khai", "Lưu riêng tư"].map((item, i) => (
          <label
            key={i}
            className="bg-white flex items-center gap-3 border border-dashed border-gray-300 rounded-md px-4 py-3 cursor-pointer hover:border-primary"
          >
            <Input type="radio" name="visibility" />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
