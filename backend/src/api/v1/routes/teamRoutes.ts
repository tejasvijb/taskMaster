import express from "express";

import { acceptTeamInvitation, createTeam, getTeamById, getTeams, inviteUserToTeam } from "../controllers/teamController.js";
import validateSchema from "../middleware/validateSchema.js";
import validateToken from "../middleware/validateToken.js";
import { teamInvitationSchema } from "../validations/teamInvitationValidate.js";
import { teamCreateSchema } from "../validations/teamValidate.js";

const router = express.Router();

router.post("/", validateToken, validateSchema(teamCreateSchema), createTeam);

router.get("/", validateToken, getTeams);

router.get("/invitations/accept", validateToken, acceptTeamInvitation);

router.get("/:teamId", validateToken, getTeamById);

router.post("/:teamId/invitations", validateToken, validateSchema(teamInvitationSchema), inviteUserToTeam);

export default router;
