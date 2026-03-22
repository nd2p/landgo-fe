import { CreatePostInput } from "./estate.validation";
import axiosClient from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  AuthorObject,
  Estate,
  EstateStatus,
  GetPostsParams,
  GetPostsResponse,
  GetMyPostsParams,
} from "./estate.types";

function mapAuthor(author?: AuthorObject): AuthorObject | undefined {
  if (!author?._id) {
    return undefined;
  }

  return {
    _id: author._id,
    name: author.name,
    avatar: author.avatar,
    phone: author.phone,
    totalScoreReceived: author.totalScoreReceived,
  };
}

function normalizeStatus(status: string): EstateStatus {
  const normalized = status.trim().toLowerCase();

  if (normalized === "approved" || normalized === "active") {
    return "Approved";
  }

  if (normalized === "pending") {
    return "Pending";
  }

  return "Rejected";
}

function mapPostToEstate(post: Estate): Estate {
  return {
    _id: post._id,
    title: post.title,
    slug: post.slug,
    description: post.description,
    price: post.price,
    area: post.area,
    province: post.province,
    district: post.district,
    ward: post.ward,
    addressDetail: post.addressDetail,
    lat: post.lat || 0,
    lng: post.lng || 0,
    numberOfBedrooms: post.numberOfBedrooms || 0,
    numberOfBathrooms: post.numberOfBathrooms || 0,
    propertyType: post.propertyType,
    legalStatus: post.legalStatus,
    frontage: post.frontage,
    entryWidth: post.entryWidth,
    direction: post.direction,
    floorNumber: post.floorNumber,
    isNegotiable: post.isNegotiable || false,
    images: post.images ?? [],
    redBookImages: post.redBookImages ?? [],
    author: mapAuthor(post.author),
    status: normalizeStatus(post.status),
    rejectionReason: post.rejectionReason,
    approvedBy: post.approvedBy,
    approvedAt: post.approvedAt,
    upvoteCount: post.upvoteCount,
    downvoteCount: post.downvoteCount,
    score: post.score,
    commentCount: post.commentCount,
    viewCount: post.viewCount,
    isPinned: post.isPinned,
    pinLevel: post.pinLevel,
    pinExpiredAt: post.pinExpiredAt,
    deletedAt: post.deletedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

export const getPosts = async (
  filters: GetPostsParams = {},
): Promise<Estate[]> => {
  try {
    const searchParams = new URLSearchParams();

    if (typeof filters.minPrice === "number") {
      searchParams.set("minPrice", filters.minPrice.toString());
    }

    if (typeof filters.maxPrice === "number") {
      searchParams.set("maxPrice", filters.maxPrice.toString());
    }

    if (filters.propertyType) {
      searchParams.set("propertyType", filters.propertyType);
    }

    if (typeof filters.minArea === "number") {
      searchParams.set("minArea", filters.minArea.toString());
    }

    if (typeof filters.maxArea === "number") {
      searchParams.set("maxArea", filters.maxArea.toString());
    }

    if (filters.province) {
      searchParams.set("province", filters.province);
    }

    if (filters.district) {
      searchParams.set("district", filters.district);
    }

    if (filters.ward) {
      searchParams.set("ward", filters.ward);
    }

    if (filters.addressDetail) {
      searchParams.set("addressDetail", filters.addressDetail);
    }

    const response = await axiosClient.get<GetPostsResponse>(
      searchParams.toString() ? `/posts?${searchParams.toString()}` : "/posts",
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to fetch posts from the server",
      );
    }

    return (response.data.data ?? []).map(mapPostToEstate);
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const backendMessage = axiosError.response?.data?.message;
    throw new Error(backendMessage || "Failed to fetch posts from the server");
  }
};

export const getEstateBySlug = async (slug: string): Promise<Estate> => {
  try {
    const response = await axiosClient.get<{
      success: boolean;
      data: Estate;
      message?: string;
    }>(`/posts/${slug}`);

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to fetch estate detail",
      );
    }

    return mapPostToEstate(response.data.data);
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const backendMessage = axiosError.response?.data?.message;
    throw new Error(backendMessage || "Failed to fetch estate detail");
  }
};

export const createPostsApi = (body: CreatePostInput) => {
  const formData = new FormData();

  const { images, redBookImages, ...textFields } = body;

  Object.entries(textFields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    formData.append(key, String(value));
  });

  images?.forEach((file) => formData.append("images", file));
  redBookImages?.forEach((file) => formData.append("redBookImages", file));

  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return axiosClient.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getMyPosts = async (
  filters: GetMyPostsParams = {},
): Promise<{ data: Estate[]; pagination: GetPostsResponse["pagination"] }> => {
  try {
    const searchParams = new URLSearchParams();

    if (filters.status) {
      searchParams.set("status", filters.status);
    }

    if (typeof filters.page === "number") {
      searchParams.set("page", filters.page.toString());
    }

    if (typeof filters.limit === "number") {
      searchParams.set("limit", filters.limit.toString());
    }

    const response = await axiosClient.get<GetPostsResponse>(
      searchParams.toString() ? `/posts/my?${searchParams.toString()}` : "/posts/my",
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to fetch user posts from the server",
      );
    }

    return {
      data: (response.data.data ?? []).map(mapPostToEstate),
      pagination: response.data.pagination,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const backendMessage = axiosError.response?.data?.message;
    throw new Error(backendMessage || "Failed to fetch user posts from the server");
  }
};
