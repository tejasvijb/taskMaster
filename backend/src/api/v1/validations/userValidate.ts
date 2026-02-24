import { z } from "zod";

// Define the schema for user registration/signup
const userRegisterSchema = z.object({
  email: z.email("Invalid email address"),
  firstName: z.string().min(1, "First name is required").max(64, "First name must be less than 64 characters"),
  lastName: z.string().min(1, "Last name is required").max(64, "Last name must be less than 64 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Define the schema for user login
const userLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Define the schema for user profile/update
const userUpdateSchema = z.object({
  email: z.email("Invalid email address").optional(),
  firstName: z.string().min(1, "First name is required").max(64, "First name must be less than 64 characters").optional(),
  lastName: z.string().min(1, "Last name is required").max(64, "Last name must be less than 64 characters").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

// Define the schema for user response (without password)
const userResponseSchema = z.object({
  createdAt: z.date(),
  email: z.email("Invalid email address"),
  firstName: z.string(),
  id: z.number(),
  lastName: z.string(),
  role: z.enum(["user", "admin"]),
  updatedAt: z.date(),
});

export type UserLoginType = z.infer<typeof userLoginSchema>;
export type UserRegisterType = z.infer<typeof userRegisterSchema>;
export type UserResponseType = z.infer<typeof userResponseSchema>;
export type UserUpdateType = z.infer<typeof userUpdateSchema>;

export { userLoginSchema, userRegisterSchema, userResponseSchema, userUpdateSchema };
export default userRegisterSchema;
