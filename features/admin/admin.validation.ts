import * as yup from "yup";

export type Role = "user" | "moderator";

export type EditUserForm = {
  name: string;
  email: string;
  phone: string;
  role: Role;
};

const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const editUserSchema: yup.ObjectSchema<EditUserForm> = yup.object({
  name: yup
    .string()
    .transform((v) => v?.replace(/\s+/g, " ").trim())
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .matches(nameRegex, "Name cannot contain numbers or special characters")
    .required("Name is required"),

  email: yup
    .string()
    .trim()
    .lowercase()
    .matches(emailRegex, "Invalid email format")
    .max(100, "Email too long")
    .required("Email is required"),

  phone: yup
    .string()
    .transform((v) => v?.replace(/\D/g, ""))
    .matches(phoneRegex, "Invalid Vietnamese phone number")
    .required("Phone is required"),

  role: yup
    .mixed<Role>()
    .oneOf(["user", "moderator"], "Invalid role")
    .required("Role is required"),
});
