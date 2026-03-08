import { CreatePostInput } from "./estate.validation";
import axiosClient from "@/lib/axios";

export const createPostsApi = (body: CreatePostInput) => {
  const formData = new FormData();

  const { images, redBookImages, ...textFields } = body;

  Object.entries(textFields).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, String(value));
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