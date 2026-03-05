import { CreatePostInput } from "./estate.types";
import axiosClient from "@/lib/axios";

// Estate API

export const createPostsApi = (
  body: CreatePostInput,
  files?: {
    images?: File[];
    redBookImages?: File[];
  },
) => {
  const formData = new FormData();

  const { images, redBookImages, ...textFields } = body;

  Object.entries(textFields).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, String(value));
    }
  });

  files?.images?.forEach((file) => {
    formData.append("images", file);
  });

  files?.redBookImages?.forEach((file) => {
    formData.append("redBookImages", file);
  });

  return axiosClient.post("/posts", formData);
};
