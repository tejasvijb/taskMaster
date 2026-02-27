import express from "express";

import { createTask, getTasks } from "../controllers/taskController.js";
import validateSchema from "../middleware/validateSchema.js";
import validateToken from "../middleware/validateToken.js";
import { taskCreateSchema } from "../validations/taskValidate.js";

const router = express.Router();

router.get("/", validateToken, getTasks);
router.post("/", validateToken, validateSchema(taskCreateSchema), createTask);

export default router;
