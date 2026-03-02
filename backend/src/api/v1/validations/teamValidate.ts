import { z } from "zod";

// Define the schema for creating a team
const teamCreateSchema = z.object({
  description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
  name: z.string().min(1, "Team name is required").max(255, "Team name must be less than 255 characters"),
});

// Define the schema for updating a team
const teamUpdateSchema = z.object({
  description: z.string().max(2000, "Description must be less than 2000 characters").optional().nullable(),
  name: z.string().min(1, "Team name is required").max(255, "Team name must be less than 255 characters").optional(),
});

// Define the schema for team response
const teamResponseSchema = z.object({
  created_at: z.date(),
  created_by: z.uuid(),
  description: z.string().nullable().optional(),
  id: z.uuid(),
  name: z.string(),
  updated_at: z.date(),
});

export type TeamCreateType = z.infer<typeof teamCreateSchema>;
export type TeamResponseType = z.infer<typeof teamResponseSchema>;
export type TeamUpdateType = z.infer<typeof teamUpdateSchema>;

export { teamCreateSchema, teamResponseSchema, teamUpdateSchema };

export default teamCreateSchema;
