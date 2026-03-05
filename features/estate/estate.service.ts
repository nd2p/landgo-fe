import { createPostsApi } from "./estate.api";
import { CreatePostInput} from "./estate.types";
import { createPostSchema } from "./estate.validation";

// CRUD estate


export const createPostsServices = async (
  body: CreatePostInput,
  files?: {
    images?: File[]
    redBookImages?: File[]
  }
) => {
  try {
    const validated = await createPostSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const response = await createPostsApi(validated, files);

    return response.data;
  } catch (error) {
    console.error("Validation error:", error);
    throw error;
  }
};
