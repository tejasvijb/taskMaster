import express from "express";

import { createTask } from "../controllers/taskController.js";
import validateSchema from "../middleware/validateSchema.js";
import validateToken from "../middleware/validateToken.js";
import { taskCreateSchema } from "../validations/taskValidate.js";

const router = express.Router();

router.post("/", validateToken, validateSchema(taskCreateSchema), createTask);

export default router;
