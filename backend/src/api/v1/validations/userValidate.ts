import { z } from "zod";

// Define the schema for user registration/signup
const userRegisterSchema = z.object({
  email: z.email("Invalid email address"),
  firstname: z.string().min(1, "First name is required").max(64, "First name must be less than 64 characters"),
  lastname: z.string().min(1, "Last name is required").max(64, "Last name must be less than 64 characters"),
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
  firstname: z.string().min(1, "First name is required").max(64, "First name must be less than 64 characters").optional(),
  lastname: z.string().min(1, "Last name is required").max(64, "Last name must be less than 64 characters").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

// Define the schema for user profile details update
const userProfileUpdateSchema = z.object({
  avatar_url: z.url("Invalid URL").max(500, "Avatar URL must be less than 500 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  timezone: z.string().max(50, "Timezone must be less than 50 characters").optional(),
});

const userRoleEnums = ["user", "admin"] as const;

const userRole = z.enum(userRoleEnums);

// Define the schema for user response (without password)
const userResponseSchema = z.object({
  created_at: z.date(),
  email: z.email("Invalid email address"),
  firstname: z.string(),
  id: z.number(),
  lastname: z.string(),
  role: userRole,
  updated_at: z.date(),
});

export type UserLoginType = z.infer<typeof userLoginSchema>;
export type UserProfileUpdateType = z.infer<typeof userProfileUpdateSchema>;
export type UserRegisterType = z.infer<typeof userRegisterSchema>;
export type UserResponseType = z.infer<typeof userResponseSchema>;
export type UserRoleType = z.infer<typeof userRole>;
export type UserUpdateType = z.infer<typeof userUpdateSchema>;

export { userLoginSchema, userProfileUpdateSchema, userRegisterSchema, userResponseSchema, userRole, userUpdateSchema };

export default userRegisterSchema;
