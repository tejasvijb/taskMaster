import express from "express";

import { createTeam, getTeamById, getTeams } from "../controllers/teamController.js";
import validateSchema from "../middleware/validateSchema.js";
import validateToken from "../middleware/validateToken.js";
import { teamCreateSchema } from "../validations/teamValidate.js";

const router = express.Router();

router.post("/", validateToken, validateSchema(teamCreateSchema), createTeam);

router.get("/", validateToken, getTeams);

router.get("/:teamId", validateToken, getTeamById);

export default router;
