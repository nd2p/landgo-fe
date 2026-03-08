import { createPostsApi } from "./estate.api";
import { CreatePostInput } from "./estate.validation";

export const createPostsServices = async (body: CreatePostInput) => {
  const response = await createPostsApi(body);
  return response.data;
};
