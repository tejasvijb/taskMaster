import { z } from "zod";

// Define the schema for inviting a user to a team
const teamInvitationSchema = z.object({
  email: z.email("Invalid email address"),
  role: z.enum(["member", "admin"]).default("member").optional(),
});

// Define the schema for team invitation response
const teamInvitationResponseSchema = z.object({
  created_at: z.date(),
  email: z.string(),
  expires_at: z.date(),
  id: z.uuid(),
  invited_by: z.uuid(),
  status: z.string(),
  team_id: z.uuid(),
  token: z.string(),
});

export type TeamInvitationResponseType = z.infer<typeof teamInvitationResponseSchema>;
export type TeamInvitationType = z.infer<typeof teamInvitationSchema>;

export { teamInvitationResponseSchema, teamInvitationSchema };

export default teamInvitationSchema;
