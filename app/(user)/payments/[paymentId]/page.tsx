"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";

import {
  getPaymentById,
} from "@/features/subscription/subscription.service";
import { SepayPayment } from "@/features/subscription/subscription.api";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams<{ paymentId: string }>();
  const paymentId = params?.paymentId;

  const [payment, setPayment] = useState<SepayPayment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId) return;

    let timer: ReturnType<typeof setInterval> | undefined;

    const fetchStatus = async () => {
      try {
        const data = await getPaymentById(paymentId as string);
        setPayment(data);

        if (data.status === "paid" || data.status === "rejected") {
          if (timer) clearInterval(timer);
        }
      } catch (err) {
        console.error(err);
        setError("Không lấy được trạng thái thanh toán");
        if (timer) clearInterval(timer);
      }
    };

    fetchStatus();
    timer = setInterval(fetchStatus, 4000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [paymentId]);

  const goToMyEstates = () => router.push("/my-estates");
  const goToPost = () => {
    if (payment?.post?.slug) router.push(`/estates/${payment.post.slug}`);
    else goToMyEstates();
  };

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-10 space-y-4">
        <p className="text-red-600 font-semibold">{error}</p>
        <Button onClick={goToMyEstates}>Về trang tin của tôi</Button>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="py-10 flex justify-center">
        <Loading label="Đang tải trang thanh toán..." />
      </div>
    );
  }

  const isSuccess = payment.status === "paid";
  const isRejected = payment.status === "rejected";

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Thanh toán VietQR</h1>
        <p className="text-slate-600">
          Mã giao dịch: <strong>{payment.transactionCode}</strong>
        </p>
        <p className="text-slate-600">
          Số tiền:{" "}
          <strong>{payment.amount.toLocaleString("vi-VN")} VND</strong>
        </p>
        <p className="text-slate-600">
          Trạng thái:{" "}
          <span
            className={
              isSuccess
                ? "text-green-600 font-semibold"
                : isRejected
                  ? "text-red-600 font-semibold"
                  : "text-amber-600 font-semibold"
            }
          >
            {payment.status}
          </span>
        </p>
      </div>

      {!isSuccess && !isRejected && payment.qrImageUrl && (
        <div className="rounded-xl border p-4 bg-white space-y-3">
          <p className="text-sm text-slate-600">
            Quét mã VietQR để hoàn tất thanh toán. Trang sẽ tự động cập nhật khi
            giao dịch được ghi nhận.
          </p>
          <div className="flex justify-center">
            <img
              src={payment.qrImageUrl}
              alt="VietQR"
              className="w-64 h-64 rounded-lg border"
            />
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="rounded-xl border p-4 bg-green-50 text-green-800">
          Thanh toán thành công! Tin đã được ghim.
        </div>
      )}

      {isRejected && (
        <div className="rounded-xl border p-4 bg-red-50 text-red-700">
          Thanh toán bị từ chối. Vui lòng thử lại hoặc liên hệ hỗ trợ.
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={goToMyEstates}>
          Về tin của tôi
        </Button>
        <Button onClick={goToPost} disabled={!isSuccess && !payment.post?.slug}>
          Xem tin
        </Button>
      </div>
    </div>
  );
}
