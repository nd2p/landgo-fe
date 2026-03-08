import { Input } from "@/components/ui/input";

type Props = {
  phone: string;
  name: string;
  email: string;
};

export default function ContactSection({ phone, name, email }: Props) {
  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Thông tin liên hệ</h2>
      <Input value={name ?? ""} readOnly placeholder="Họ tên" />
      <Input value={email ?? ""} readOnly placeholder="Email" />
      <Input value={phone ?? ""} readOnly placeholder="Số điện thoại" />
    </section>
  );
}