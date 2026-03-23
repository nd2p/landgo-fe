import { CreatePostInput, PaymentDurationType, PropertyType } from "./estate.types";

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

export const validateEstateForm = (
  state: EstateFormState,
  options: { isEdit?: boolean } = {},
): EstateFormErrors => {
  const errors: EstateFormErrors = {};

  if (!state.province) errors.province = "Vui long chon tinh / thanh pho";
  if (!state.district) errors.district = "Vui long chon quan / huyen";
  if (!state.ward) errors.ward = "Vui long chon phuong / xa";

  if (!state.propertyType) {
    errors.propertyType = "Vui long chon loai bat dong san";
  }

  if (state.area === null) {
    errors.area = "Vui long nhap dien tich";
  } else if (state.area < 0) {
    errors.area = "Dien tich khong hop le";
  }

  if (state.price === null) {
    errors.price = "Vui long nhap gia";
  } else if (state.price < 0) {
    errors.price = "Gia khong hop le";
  }

  if (state.numberOfBedrooms === null) {
    errors.numberOfBedrooms = "Vui long nhap so phong ngu";
  } else if (state.numberOfBedrooms < 0) {
    errors.numberOfBedrooms = "So phong ngu khong hop le";
  }

  if (state.numberOfBathrooms === null) {
    errors.numberOfBathrooms = "Vui long nhap so phong tam";
  } else if (state.numberOfBathrooms < 0) {
    errors.numberOfBathrooms = "So phong tam khong hop le";
  }

  if (!state.legalStatus.trim()) {
    errors.legalStatus = "Vui long nhap tinh trang phap ly";
  }

  if (!state.title.trim()) errors.title = "Vui long nhap tieu de";
  if (!state.description.trim()) errors.description = "Vui long nhap mo ta";

  if (!options.isEdit) {
    if (!state.images.length) errors.images = "Vui long tai it nhat 1 anh";
    if (!state.redBookImages.length) {
      errors.redBookImages = "Vui long tai it nhat 1 anh so do";
    }
  }

  if (state.isPinned) {
    if (!state.pinLevel) {
      errors.pinLevel = "Vui long chon loai tin VIP";
    }
    if (!state.pinDurationType) {
      errors.pinExpiredAt = "Vui long chon thoi gian ghim";
    }
  }

  return errors;
};

export const toCreatePostInput = (
  state: EstateFormState,
): CreatePostInput => ({
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
  isPinned: false,
  pinLevel: null,
  pinExpiredAt: null,
  pinDurationType: "",
  phone: state.phone.trim(),
  name: state.name.trim(),
  email: state.email.trim(),
});
