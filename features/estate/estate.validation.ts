import * as yup from "yup";
import { PropertyType } from "@/features/estate/estate.types";

export const createPostSchema = yup.object({
  province: yup.string().required("Vui lòng chọn tỉnh / thành phố"),
  district: yup.string().required("Vui lòng chọn quận / huyện"),
  ward: yup.string().required("Vui lòng chọn phường / xã"),
  addressDetail: yup.string().optional(),

  lat: yup
    .number()
    .typeError("Vĩ độ phải là số")
    .required("Vui lòng nhập vĩ độ")
    .min(-90, "Vĩ độ phải từ -90 đến 90")
    .max(90, "Vĩ độ phải từ -90 đến 90"),

  lng: yup
    .number()
    .typeError("Kinh độ phải là số")
    .required("Vui lòng nhập kinh độ")
    .min(-180, "Kinh độ phải từ -180 đến 180")
    .max(180, "Kinh độ phải từ -180 đến 180"),

  numberOfBedrooms: yup
    .number()
    .typeError("Số phòng ngủ phải là số")
    .required("Vui lòng nhập số phòng ngủ")
    .min(0, "Số phòng ngủ không được âm"),

  numberOfBathrooms: yup
    .number()
    .typeError("Số phòng tắm phải là số")
    .required("Vui lòng nhập số phòng tắm")
    .min(0, "Số phòng tắm không được âm"),

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

  frontage: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Mặt tiền phải là số")
    .optional()
    .min(0, "Mặt tiền không được âm"),

  entryWidth: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Lối vào phải là số")
    .optional()
    .min(0, "Lối vào không được âm"),

  direction: yup.string().optional().max(50, "Tối đa 50 ký tự"),

  floorNumber: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Số tầng phải là số")
    .optional()
    .min(0, "Số tầng không được âm"),

  legalStatus: yup
    .string()
    .required("Vui lòng nhập tình trạng pháp lý")
    .max(200, "Tối đa 200 ký tự"),

  isNegotiable: yup.boolean().required(),

  redBookImages: yup
    .array(yup.mixed<File>().required())
    .min(1, "Vui lòng upload ít nhất 1 ảnh sổ đỏ")
    .required() as yup.ArraySchema<File[], yup.AnyObject>,

  images: yup
    .array(yup.mixed<File>().required())
    .min(1, "Vui lÃ²ng upload Ã­t nháº¥t 1 áº£nh")
    .required() as yup.ArraySchema<File[], yup.AnyObject>,

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

  isPinned: yup.boolean().optional(),

  pinLevel: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("Pin level phải là số")
    .nullable()
    .optional()
    .min(0, "Pin level không được âm"),

  pinExpiredAt: yup.string().nullable().optional(),
});

export type CreatePostInput = yup.InferType<typeof createPostSchema>;
