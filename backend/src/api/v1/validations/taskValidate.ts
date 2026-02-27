import { z } from "zod";

// Define the schema for creating a task
const taskCreateSchema = z.object({
  assigned_to: z.uuid("Invalid assigned_to UUID").optional(),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
  due_date: z.iso.date().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["open", "in_progress", "completed", "closed"] as const).default("open"),
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
});

// Define the schema for updating a task
const taskUpdateSchema = z.object({
  assigned_to: z.uuid("Invalid assigned_to UUID").optional().nullable(),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
  due_date: z.iso.date().optional().nullable(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  status: z.enum(["open", "in_progress", "completed", "closed"]).optional(),
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters").optional(),
});

// Define the schema for task response
const taskResponseSchema = z.object({
  assigned_to: z.uuid().nullable(),
  completed_at: z.date().nullable().optional(),
  created_at: z.date(),
  created_by: z.uuid(),
  description: z.string().nullable().optional(),
  due_date: z.date().nullable().optional(),
  id: z.uuid(),
  priority: z.string(),
  status: z.string(),
  title: z.string(),
  updated_at: z.date(),
});

// Define the schema for task query filters
const taskQuerySchema = z.object({
  assignedTo: z.enum(["me"]).optional(),
  search: z.string().max(255, "Search term must be less than 255 characters").optional(),
  status: z.enum(["open", "in_progress", "completed", "closed"]).optional(),
});

export type TaskCreateType = z.infer<typeof taskCreateSchema>;
export type TaskQueryType = z.infer<typeof taskQuerySchema>;
export type TaskResponseType = z.infer<typeof taskResponseSchema>;
export type TaskUpdateType = z.infer<typeof taskUpdateSchema>;

export { taskCreateSchema, taskQuerySchema, taskResponseSchema, taskUpdateSchema };

export default taskCreateSchema;
