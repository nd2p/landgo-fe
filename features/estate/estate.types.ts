export type EstateStatus = "Pending" | "Approved" | "Rejected";

export interface Estate {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  area: number;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  lat: number;
  lng: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  propertyType: string;
  legalStatus: string;
  isNegotiable: boolean;
  images: string[];
  redBookImages: string[];
  author: string;
  status: EstateStatus;
  rejectionReason: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  upvoteCount: number;
  downvoteCount: number;
  score: number;
  commentCount: number;
  viewCount: number;
  isPinned: boolean;
  pinLevel: number | null;
  pinExpiredAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
