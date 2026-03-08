import { PinLevel, type EstateStatus } from "@/features/estate/estate.types";

export const PRICE_MIN = 0;
export const PRICE_MAX = 60;
export const PRICE_STEP = 0.5;

export const AREA_MIN = 0;
export const AREA_MAX = 500;
export const AREA_STEP = 5;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function parseAreaPreset(value: string) {
  if (value === "under-30") {
    return { min: 0, max: 30 };
  }

  if (value === "30-50") {
    return { min: 30, max: 50 };
  }

  if (value === "50-80") {
    return { min: 50, max: 80 };
  }

  if (value === "80-100") {
    return { min: 80, max: 100 };
  }

  if (value === "100-150") {
    return { min: 100, max: 150 };
  }

  if (value === "150-200") {
    return { min: 150, max: 200 };
  }

  if (value === "200-250") {
    return { min: 200, max: 250 };
  }

  if (value === "250-300") {
    return { min: 250, max: 300 };
  }

  if (value === "300-350") {
    return { min: 300, max: 350 };
  }

  if (value === "350-400") {
    return { min: 350, max: 400 };
  }

  if (value === "400-450") {
    return { min: 400, max: 450 };
  }

  if (value === "450-500") {
    return { min: 450, max: 500 };
  }

  if (value === "over-500") {
    return { min: 500, max: AREA_MAX };
  }

  return { min: AREA_MIN, max: AREA_MAX };
}

export function parsePricePreset(value: string) {
  if (value === "under-500") {
    return { min: 0, max: 500000000 };
  }

  if (value === "500-800") {
    return { min: 500000000, max: 800000000 };
  }

  if (value === "800-1000") {
    return { min: 800000000, max: 1000000000 };
  }

  if (value === "1-2") {
    return { min: 1000000000, max: 2000000000 };
  }

  if (value === "2-3") {
    return { min: 2000000000, max: 3000000000 };
  }

  if (value === "3-5") {
    return { min: 3000000000, max: 5000000000 };
  }

  if (value === "5-7") {
    return { min: 5000000000, max: 7000000000 };
  }

  if (value === "7-10") {
    return { min: 7000000000, max: 10000000000 };
  }

  if (value === "10-20") {
    return { min: 10000000000, max: 20000000000 };
  }

  if (value === "20-30") {
    return { min: 20000000000, max: 30000000000 };
  }

  if (value === "30-40") {
    return { min: 30000000000, max: 40000000000 };
  }

  if (value === "40-60") {
    return { min: 40000000000, max: 60000000000 };
  }

  if (value === "over-60") {
    return { min: 59500000000, max: 60000000000 };
  }

  return { min: PRICE_MIN, max: PRICE_MAX };
}

export function formatPriceDisplay(priceInBillion: number) {
  if (priceInBillion === 0) {
    return "0";
  }

  if (priceInBillion < 1) {
    return `${Math.round(priceInBillion * 1000)} triệu`;
  }

  if (Number.isInteger(priceInBillion)) {
    return `${priceInBillion} tỷ`;
  }

  return `${priceInBillion.toFixed(1)} tỷ`;
}

export function formatPrice(price: number) {
  if (price >= 1_000_000_000) {
    const valueInBillions = price / 1_000_000_000;
    return `${new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: valueInBillions % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 1,
    }).format(valueInBillions)} tỷ`;
  }

  if (price >= 1_000_000) {
    const valueInMillions = price / 1_000_000;
    return `${new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: valueInMillions % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 1,
    }).format(valueInMillions)} triệu`;
  }

  return `${new Intl.NumberFormat("vi-VN").format(price)} VND`;
}

export function formatPricePerSqm(price: number, area: number) {
  if (!area) {
    return "N/A";
  }

  const value = price / area;
  return `${new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}/m2`;
}

export function getStatusVariant(status: EstateStatus) {
  if (status === "Approved") {
    return "success";
  }

  if (status === "Pending") {
    return "secondary";
  }

  return "destructive";
}

export function getPinLevelVariant(pinLevel: number | null) {
  if (pinLevel === PinLevel.VIP) {
    return "default";
  }

  if (pinLevel === PinLevel.SUPER) {
    return "destructive";
  }

  return undefined;
}
