import * as yup from "yup";
import { PropertyType } from "@/features/estate/estate.types";

export const createPostSchema = yup.object({
  province: yup.string().required("Vui lòng chọn tỉnh / thành phố"),
  district: yup.string().required("Vui lòng chọn quận / huyện"),
  ward: yup.string().required("Vui lòng chọn phường / xã"),
  addressDetail: yup.string().optional(),

  propertyType: yup
    .mixed<PropertyType>()
    .oneOf(Object.values(PropertyType), "Vui lòng chọn loại bất động sản")
    .required("Vui lòng chọn loại bất động sản"),
  area: yup
    .number()
    .typeError("Diện tích phải là số")
    .required("Vui lòng nhập diện tích")
    .min(0, "Diện tích phải lớn hơn 0"),
  price: yup
    .number()
    .typeError("Giá phải là số")
    .required("Vui lòng nhập giá")
    .min(0, "Giá phải lớn hơn 0"),

  legalStatus: yup
    .string()
    .required("Vui lòng nhập tình trạng pháp lý")
    .max(200, "Tối đa 200 ký tự"),
 
  redBookImages: yup
    .array(yup.mixed<File>().required())
    .min(1, "Vui lòng upload ít nhất 1 ảnh sổ đỏ")
    .required() as yup.ArraySchema<File[], yup.AnyObject>,
  images: yup
    .array(yup.mixed<File>().required())
    .optional() as yup.ArraySchema<File[], yup.AnyObject>,

  title: yup
    .string()
    .required("Vui lòng nhập tiêu đề")
    .min(5, "Tiêu đề tối thiểu 5 ký tự")
    .max(200, "Tiêu đề tối đa 200 ký tự"),
  description: yup
    .string()
    .required("Vui lòng nhập mô tả")
    .min(10, "Mô tả tối thiểu 10 ký tự")
    .max(10000, "Mô tả tối đa 10000 ký tự"),

  phone: yup.string().required("Vui lòng nhập số điện thoại"),
  name: yup
    .string()
    .required("Vui lòng nhập họ tên")
    .min(2, "Họ tên tối thiểu 2 ký tự")
    .max(100, "Họ tên tối đa 100 ký tự"),
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không đúng định dạng"),
});

export type CreatePostInput = yup.InferType<typeof createPostSchema>;