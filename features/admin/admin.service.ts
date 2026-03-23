import axiosClient from "@/lib/axios";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string | null;
  isBanned?: boolean;
  isPhoneVerified?: boolean;
  totalScoreReceived?: number;
  createdAt?: string;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type AdminPostStatus = "active" | "inactive" | string;

export interface AdminPost {
  _id: string;
  title: string;
  slug: string;
  status: AdminPostStatus;
  propertyType: string;
  price: number;
  area: number;
  viewCount: number;
  score: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    _id?: string;
    name?: string;
    phone?: string;
    avatar?: string | null;
  } | null;
}

interface AdminPostsApiResponse {
  success: boolean;
  data: AdminPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminPostsResult {
  data: AdminPost[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface AdminPostStatusMap {
  active: number;
  inactive: number;
}

export interface AdminPostOverview {
  totalPosts: number;
  totalAllPosts: number;
  totalViews: number;
  totalComments: number;
  pinnedPosts: number;
  totalScore: number;
  activeRate: number;
}

export interface AdminPostTypeDistribution {
  propertyType: string;
  count: number;
  percent: number;
}

export interface AdminPostDailyStat {
  date: string;
  label: string;
  count: number;
}

export interface AdminTopViewedPost {
  _id: string;
  title: string;
  slug: string;
  status: AdminPostStatus;
  viewCount: number;
  score: number;
  propertyType: string;
  createdAt: string;
}

export interface AdminPostStats {
  overview: AdminPostOverview;
  byStatus: AdminPostStatusMap;
  propertyTypeDistribution: AdminPostTypeDistribution[];
  last7Days: AdminPostDailyStat[];
  topViewedPosts: AdminTopViewedPost[];
}

interface PostStatsResponse {
  success: boolean;
  data: AdminPostStats;
}

export interface AdminUsersResult {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminService = {
  async getUsers(params?: { page?: number; limit?: number }): Promise<User[]> {
    const res = await axiosClient.get<UsersResponse>("/users", { params });
    return res.data.users ?? [];
  },

  async getUsersWithPagination(params?: {
    page?: number;
    limit?: number;
  }): Promise<AdminUsersResult> {
    const res = await axiosClient.get<UsersResponse>("/users", { params });
    const pagination = res.data.pagination;

    return {
      users: res.data.users ?? [],
      pagination: {
        total: pagination?.total ?? 0,
        page: pagination?.page ?? params?.page ?? 1,
        limit: pagination?.limit ?? params?.limit ?? 10,
        totalPages: pagination?.totalPages ?? 1,
      },
    };
  },

  async deleteUser(id: string) {
    await axiosClient.delete(`/users/${id}`);
  },

  async updateUser(id: string, data: Partial<User>) {
    const res = await axiosClient.patch(`/users/${id}`, data);
    return res.data;
  },

  async getPostStats(): Promise<AdminPostStats> {
    const res = await axiosClient.get<PostStatsResponse>("/posts/stats");
    return res.data.data;
  },

  async getPosts(params: {
    status?: "active" | "inactive" | "all";
    page?: number;
    limit?: number;
  }): Promise<AdminPostsResult> {
    const query = {
      status: params.status && params.status !== "all" ? params.status : undefined,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      includeInactive: true,
    };

    const res = await axiosClient.get<AdminPostsApiResponse>("/posts", { params: query });
    const pagination = res.data.pagination;

    return {
      data: res.data.data ?? [],
      total: pagination?.total ?? 0,
      page: pagination?.page ?? 1,
      pages: pagination?.pages ?? 1,
      limit: pagination?.limit ?? query.limit,
    };
  },

  async deactivatePost(id: string) {
    await axiosClient.delete(`/posts/${id}`);
  },

  async activatePost(id: string) {
    await axiosClient.patch(`/posts/${id}/review`, { action: "approve" });
  },
};
