import { CreatePostInput, PropertyType } from "./estate.types";

export type EstateFormState = {
  title: string;
  description: string;
  price: number | null;
  area: number | null;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  lat: number | null;
  lng: number | null;
  frontage: number | null;
  entryWidth: number | null;
  direction: string;
  floorNumber: number | null;
  numberOfBedrooms: number | null;
  numberOfBathrooms: number | null;
  propertyType: PropertyType | "";
  legalStatus: string;
  isNegotiable: boolean;
  images: File[];
  redBookImages: File[];
  isPinned: boolean;
  pinLevel: 1 | 2 | null;
  pinExpiredAt: string | null;
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
  lat: 0,
  lng: 0,
  frontage: null,
  entryWidth: null,
  direction: "",
  floorNumber: null,
  numberOfBedrooms: null,
  numberOfBathrooms: null,
  propertyType: "",
  legalStatus: "",
  isNegotiable: false,
  images: [],
  redBookImages: [],
  isPinned: false,
  pinLevel: null,
  pinExpiredAt: null,
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

  if (!state.legalStatus.trim()) {
    errors.legalStatus = "Vui lòng nhập tình trạng pháp lý";
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
    if (!state.pinExpiredAt) {
      errors.pinExpiredAt = "Vui lòng chọn thời gian ghim";
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
  legalStatus: state.legalStatus.trim(),
  isNegotiable: state.isNegotiable,
  images: state.images.length ? state.images : undefined,
  redBookImages: state.redBookImages,
  isPinned: state.isPinned,
  pinLevel: state.isPinned ? state.pinLevel : null,
  pinExpiredAt: state.isPinned ? state.pinExpiredAt : null,
  phone: state.phone.trim(),
  name: state.name.trim(),
  email: state.email.trim(),
});
