import axiosClient from "@/lib/axios";
import {
  PaymentDurationType,
  PaymentStatus,
} from "@/features/estate/estate.types";

export type SepayPayment = {
  _id: string;
  post: { _id: string; title?: string; slug?: string };
  pinLevel: 1 | 2;
  durationType: PaymentDurationType;
  amount: number;
  status: PaymentStatus;
  qrImageUrl?: string | null;
  transactionCode?: string | null;
  method: "sepay_qr" | "manual_transfer";
  pinExpiresAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export const createSepayPaymentApi = async (params: {
  postId: string;
  pinLevel: 1 | 2;
  durationType: PaymentDurationType;
}): Promise<SepayPayment> => {
  const response = await axiosClient.post<ApiResponse<SepayPayment>>(
    "/payments/sepay/initiate",
    params,
  );

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Không tạo được đơn thanh toán");
  }

  return response.data.data;
};

export const getPaymentByIdApi = async (
  paymentId: string,
): Promise<SepayPayment> => {
  const response = await axiosClient.get<ApiResponse<SepayPayment>>(
    `/payments/${paymentId}`,
  );

  if (!response.data?.success) {
    throw new Error(response.data?.message || "Không lấy được trạng thái thanh toán");
  }

  return response.data.data;
};
