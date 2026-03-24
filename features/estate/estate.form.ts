import {
  CreatePostInput,
  PaymentDurationType,
  PropertyType,
} from "./estate.types";

export type EstateFormState = {
  title: string;
  description: string;
  price: number | null;
  area: number | null;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  mapUrl: string;
  lat: number | null;
  lng: number | null;
  frontage: number | null;
  entryWidth: number | null;
  direction: string;
  floorNumber: number | null;
  numberOfBedrooms: number | 0;
  numberOfBathrooms: number | 0;
  propertyType: PropertyType | "";
  isNegotiable: boolean;
  images: File[];
  redBookImages: File[];
  existingImages: string[];
  existingRedBookImages: string[];
  isPinned: boolean;
  pinLevel: 1 | 2 | null;
  pinExpiredAt: string | null;
  pinDurationType: PaymentDurationType | "";
  phone: string;
  name: string;
  email: string;
};

export type EstateFormErrors = Partial<Record<keyof EstateFormState, string>>;

export type FieldChangeHandler = <K extends keyof EstateFormState>(
  field: K,
  value: EstateFormState[K],
) => void;

export const createEstateFormDefaults = (
  overrides: Partial<EstateFormState> = {},
): EstateFormState => ({
  title: "",
  description: "",
  price: null,
  area: null,
  province: "",
  district: "",
  ward: "",
  addressDetail: "",
  mapUrl: "",
  lat: 0,
  lng: 0,
  frontage: null,
  entryWidth: null,
  direction: "",
  floorNumber: null,
  numberOfBedrooms: 0,
  numberOfBathrooms: 0,
  propertyType: "",
  isNegotiable: false,
  images: [],
  redBookImages: [],
  existingImages: [],
  existingRedBookImages: [],
  isPinned: false,
  pinLevel: null,
  pinExpiredAt: null,
  pinDurationType: "",
  phone: "",
  name: "",
  email: "",
  ...overrides,
});

export const parseNumberInput = (value: string): number | null => {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

type LatLng = { lat: number; lng: number };

const isValidLatLng = ({ lat, lng }: LatLng) =>
  lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

const parsePair = (text: string): LatLng | null => {
  const match = text.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;

  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

  const candidate = { lat, lng };
  return isValidLatLng(candidate) ? candidate : null;
};

export const extractLatLngFromMapInput = (input: string): LatLng | null => {
  const raw = input.trim();
  if (!raw) return null;

  const direct = parsePair(raw);
  if (direct) return direct;

  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }

  const fromAt = parsePair(decoded.match(/@([^/?]+)/)?.[1] ?? "");
  if (fromAt) return fromAt;

  const queryCandidates = [
    decoded.match(/[?&](?:q|query|ll)=([^&#]+)/i)?.[1],
    decoded.match(/[?&](?:destination|center)=([^&#]+)/i)?.[1],
  ];

  for (const candidate of queryCandidates) {
    if (!candidate) continue;
    const parsed = parsePair(candidate);
    if (parsed) return parsed;
  }

  return null;
};
export const validateEstateForm = (
  state: EstateFormState,
  options: { isEdit?: boolean } = {},
): EstateFormErrors => {
  const errors: EstateFormErrors = {};

  if (!state.province) errors.province = "Vui lòng chọn tỉnh / thành phố";
  if (!state.district) errors.district = "Vui lòng chọn quận / huyện";
  if (!state.ward) errors.ward = "Vui lòng chọn phường / xã";

  if (!state.propertyType) {
    errors.propertyType = "Vui lòng chọn loại bất động sản";
  }

  if (state.area === null) {
    errors.area = "Vui lòng nhập diện tích";
  } else if (state.area < 0) {
    errors.area = "Diện tích không hợp lệ";
  }

  if (state.price === null) {
    errors.price = "Vui lòng nhập giá";
  } else if (state.price < 0) {
    errors.price = "Giá không hợp lệ";
  }

  if (state.numberOfBedrooms === null) {
    errors.numberOfBedrooms = "Vui lòng nhập số phòng ngủ";
  } else if (state.numberOfBedrooms < 0) {
    errors.numberOfBedrooms = "Số phòng ngủ không hợp lệ";
  }

  if (state.numberOfBathrooms === null) {
    errors.numberOfBathrooms = "Vui lòng nhập số phòng tắm";
  } else if (state.numberOfBathrooms < 0) {
    errors.numberOfBathrooms = "Số phòng tắm không hợp lệ";
  }

  if (!state.title.trim()) errors.title = "Vui lòng nhập tiêu đề";
  if (!state.description.trim()) errors.description = "Vui lòng nhập mô tả";

  if (!options.isEdit) {
    if (!state.images.length) {
      errors.images = "Vui lòng tải lên ít nhất 1 ảnh";
    }
    if (!state.redBookImages.length) {
      errors.redBookImages = "Vui lòng tải lên ít nhất 1 ảnh sổ đỏ";
    }
  }

  if (state.isPinned) {
    if (!state.pinLevel) {
      errors.pinLevel = "Vui lòng chọn loại tin VIP";
    }
    if (!state.pinDurationType) {
      errors.pinExpiredAt = "Vui long chon thoi gian ghim";
    }
  }

  return errors;
};

export const toCreatePostInput = (state: EstateFormState): CreatePostInput => ({
  title: state.title.trim(),
  description: state.description.trim(),
  price: state.price ?? 0,
  area: state.area ?? 0,
  province: state.province,
  district: state.district,
  ward: state.ward,
  addressDetail: state.addressDetail.trim() || undefined,
  lat: state.lat ?? 0,
  lng: state.lng ?? 0,
  frontage: state.frontage ?? undefined,
  entryWidth: state.entryWidth ?? undefined,
  direction: state.direction.trim() || undefined,
  floorNumber: state.floorNumber ?? undefined,
  numberOfBedrooms: state.numberOfBedrooms ?? 0,
  numberOfBathrooms: state.numberOfBathrooms ?? 0,
  propertyType: state.propertyType as PropertyType,
  isNegotiable: state.isNegotiable,
  images: state.images.length ? state.images : undefined,
  redBookImages: state.redBookImages,
  isPinned: false,
  pinLevel: null,
  pinExpiredAt: null,
  pinDurationType: "",
  phone: state.phone.trim(),
  name: state.name.trim(),
  email: state.email.trim(),
});

export const toUpdatePostInput = (state: EstateFormState) => ({
  title: state.title.trim(),
  description: state.description.trim(),
  price: state.price ?? 0,
  area: state.area ?? 0,
  province: state.province,
  district: state.district,
  ward: state.ward,
  addressDetail: state.addressDetail.trim() || undefined,
  lat: state.lat ?? 0,
  lng: state.lng ?? 0,
  frontage: state.frontage ?? undefined,
  entryWidth: state.entryWidth ?? undefined,
  direction: state.direction.trim() || undefined,
  floorNumber: state.floorNumber ?? undefined,
  numberOfBedrooms: state.numberOfBedrooms ?? 0,
  numberOfBathrooms: state.numberOfBathrooms ?? 0,
  propertyType: state.propertyType as PropertyType,
  isNegotiable: state.isNegotiable,
  images: state.images.length ? state.images : undefined,
  redBookImages: state.redBookImages,
  existingImages: state.existingImages,
  existingRedBookImages: state.existingRedBookImages,
});
