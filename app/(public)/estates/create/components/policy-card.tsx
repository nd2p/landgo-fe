import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PolicyCard() {
  return (
    <div className="bg-primary/10 rounded-lg shadow-sm p-4">
      <h4 className="text-lg font-semibold mb-4">
        Chính sách hỗ trợ thành viên đăng tin:
      </h4>

      <ul className="space-y-2 text-[15px] text-[#212529]">
        {[
          "Tặng 1 năm cho Tài khoản check quy hoạch VIP trị giá 2.000.000đ.",
          "Tặng 5.000.000đ vào Tài khoản đăng tin VIP.",
          "Tặng VIP 1★ cho tất cả tin đăng hợp lệ trên bản đồ Guland.",
        ].map((item, i) => (
          <li key={i} className="relative pl-9 leading-relaxed">
            <span className="absolute left-0 top-[3px] w-[21px] h-[21px] bg-[url('https://guland.vn/bds_2/img/mdi/checkbox-marked-circle-outline.svg')] bg-contain bg-no-repeat" />
            {item}
          </li>
        ))}
      </ul>

      <div className="flex gap-4 mt-5">
        <Button asChild className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
          <Link href="#">Điều kiện</Link>
        </Button>
        <Button asChild className="flex-1 bg-green-500 hover:bg-green-600 text-white">
          <Link href="#">Zalo hỗ trợ</Link>
        </Button>
      </div>
    </div>
  );
}