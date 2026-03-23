// Estate types
export enum PropertyType {
  Apartment = "apartment",
  House = "house",
  Land = "land",
  Villa = "villa",
}

export type PaymentDurationType = "week" | "month" | "year";
export type PaymentStatus = "pending" | "paid" | "rejected";

export const PropertyTypeLabel: Record<PropertyType, string> = {
  [PropertyType.Apartment]: "Chung cư",
  [PropertyType.House]: "Nhà ở",
  [PropertyType.Land]: "Đất nền",
  [PropertyType.Villa]: "Biệt thự",
};

export type CreatePostInput = {
  title: string;
  description: string;
  price: number;
  area: number;
  province: string;
  district: string;
  ward: string;
  addressDetail?: string;
  lat: number;
  lng: number;
  frontage?: number;
  entryWidth?: number;
  direction?: string;
  floorNumber?: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  propertyType: PropertyType;
  legalStatus: string;
  isNegotiable: boolean;
  images?: File[];
  redBookImages: File[];
  isPinned: boolean;
  pinLevel: 1 | 2 | null;
  pinExpiredAt: string | null;
  pinDurationType?: PaymentDurationType | "";
  phone?: string;
  name?: string;
  email?: string;
};

export type EstateStatus = "Pending" | "Approved" | "Rejected";

export type Estate = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  area: number;
  province: {
    _id: string;
    name: string;
  };
  district: {
    _id: string;
    name: string;
  };
  ward: {
    _id: string;
    name: string;
  };
  addressDetail: string;
  lat: number;
  lng: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  propertyType: string;
  legalStatus: string;
  frontage?: number;
  entryWidth?: number;
  direction?: string;
  floorNumber?: number;
  isNegotiable: boolean;
  images: string[];
  redBookImages: string[];
  author: AuthorObject | undefined;
  status: EstateStatus;
  rejectionReason: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  upvoteCount: number;
  downvoteCount: number;
  score: number;
  commentCount: number;
  viewCount: number;
  isPinned?: boolean;
  pinLevel?: number | null;
  pinExpiredAt?: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GetPostsResponse = {
  success: boolean;
  data: Estate[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
};

export type GetPostsParams = {
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  minArea?: number;
  maxArea?: number;
  province?: string;
  district?: string;
  ward?: string;
  addressDetail?: string;
};

export type GetMyPostsParams = {
  status?: string;
  page?: number;
  limit?: number;
};

export type LocationObject = {
  _id: string;
  name: string;
};

export type AuthorObject = {
  _id: string;
  phone: string | null;
  name: string;
  avatar: string | null;
  totalScoreReceived: number;
};

export type EstateCardViewMode = "list" | "grid";

export interface EstateCardProps {
  estate: Estate;
  viewMode?: EstateCardViewMode;
}

export enum PinLevel {
  VIP = 1,
  SUPER = 2,
}
