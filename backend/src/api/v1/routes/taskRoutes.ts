import express from "express";

import { createTask, getTasks, updateTask } from "../controllers/taskController.js";
import validateSchema from "../middleware/validateSchema.js";
import validateToken from "../middleware/validateToken.js";
import { taskCreateSchema, taskUpdateSchema } from "../validations/taskValidate.js";

const router = express.Router();

router.get("/", validateToken, getTasks);
router.post("/", validateToken, validateSchema(taskCreateSchema), createTask);
router.put("/:id", validateToken, validateSchema(taskUpdateSchema), updateTask);

export default router;
