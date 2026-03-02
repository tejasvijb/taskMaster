import { z } from "zod";

// Define the schema for creating an attachment
const attachmentCreateSchema = z.object({
  file_name: z.string().min(1, "File name is required").max(255, "File name must be less than 255 characters"),
  file_size: z.number().positive("File size must be positive"),
  file_url: z.url("Invalid file URL"),
  mime_type: z.string().min(1, "MIME type is required").max(100, "MIME type must be less than 100 characters"),
  task_id: z.uuid("Invalid task_id UUID"),
});

// Define the schema for attachment response
const attachmentResponseSchema = z.object({
  created_at: z.date(),
  file_name: z.string(),
  file_size: z.number(),
  file_url: z.string(),
  id: z.uuid(),
  mime_type: z.string(),
  task_id: z.uuid(),
  updated_at: z.date(),
  uploaded_by: z.uuid(),
});

export type AttachmentCreateType = z.infer<typeof attachmentCreateSchema>;
export type AttachmentResponseType = z.infer<typeof attachmentResponseSchema>;

export { attachmentCreateSchema, attachmentResponseSchema };

export default attachmentCreateSchema;
