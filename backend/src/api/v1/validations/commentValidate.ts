import { z } from "zod";

// Define the schema for creating a comment
const commentCreateSchema = z.object({
  content: z.string().min(1, "Comment content is required").max(5000, "Comment must be less than 5000 characters"),
  task_id: z.uuid("Invalid task_id UUID"),
});

// Define the schema for updating a comment
const commentUpdateSchema = z.object({
  content: z.string().min(1, "Comment content is required").max(5000, "Comment must be less than 5000 characters"),
});

// Define the schema for comment response
const commentResponseSchema = z.object({
  content: z.string(),
  created_at: z.date(),
  id: z.uuid(),
  task_id: z.uuid(),
  updated_at: z.date(),
  user_id: z.uuid(),
});

export type CommentCreateType = z.infer<typeof commentCreateSchema>;
export type CommentResponseType = z.infer<typeof commentResponseSchema>;
export type CommentUpdateType = z.infer<typeof commentUpdateSchema>;

export { commentCreateSchema, commentResponseSchema, commentUpdateSchema };

export default commentCreateSchema;
