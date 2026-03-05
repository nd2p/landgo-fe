// Estate validation
import * as yup from "yup";
import { PropertyType } from "./estate.types";

export const createPostSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title is too long"),

  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(10000, "Description is too long"),

  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be greater than 0"),

  area: yup
    .number()
    .required("Area is required")
    .min(0, "Area must be greater than 0"),

  province: yup.string().required("Province is required"),

  district: yup.string().required("District is required"),

  ward: yup.string().required("Ward is required"),

  addressDetail: yup.string().optional(),

  propertyType: yup
    .mixed<PropertyType>()
    .oneOf(Object.values(PropertyType))
    .required("Property type is required"),

  legalStatus: yup
    .string()
    .required("Legal status is required")
    .max(200, "The text is too long."),

  images: yup
    .array()
    .of(yup.string().url("Image must be a valid URL").required())
    .optional(),

  redBookImages: yup
    .array()
    .of(yup.string().url("Red book image must be a valid URL").required())
    .min(1, "At least one red book image is required")
    .required(),
});

export type CreatePostInput = yup.InferType<typeof createPostSchema>;
