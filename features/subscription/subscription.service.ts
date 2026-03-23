import { PaymentDurationType } from "@/features/estate/estate.types";
import {
  createSepayPaymentApi,
  getPaymentByIdApi,
  SepayPayment,
} from "./subscription.api";

export const createSepayPayment = (params: {
  postId: string;
  pinLevel: 1 | 2;
  durationType: PaymentDurationType;
}): Promise<SepayPayment> => createSepayPaymentApi(params);

export const getPaymentById = (paymentId: string): Promise<SepayPayment> =>
  getPaymentByIdApi(paymentId);
