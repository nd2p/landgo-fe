import * as yup from "yup";

export const provinceSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Province name is required")
    .max(100, "Province name too long"),

  code: yup
    .string()
    .trim()
    .required("Province code is required")
    .max(10, "Province code too long"),
});

export const districtSchema = yup.object({
  name: yup.string().trim().required("District name is required").max(100),

  code: yup.string().trim().required("District code is required").max(10),

  province: yup
    .string()
    .required("Province id is required")
    .length(24, "Invalid province id"),
});

export const wardSchema = yup.object({
  name: yup.string().trim().required("Ward name is required").max(100),

  code: yup.string().trim().required("Ward code is required").max(10),

  district: yup
    .string()
    .required("District id is required")
    .length(24, "Invalid district id"),
});

export const paginationSchema = yup.object({
  page: yup.number().optional(),
  limit: yup.number().optional(),
});
