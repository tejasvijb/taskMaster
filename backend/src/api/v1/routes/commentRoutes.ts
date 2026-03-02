import express from "express";

import { createComment, deleteComment, getTaskComments, updateComment } from "../controllers/commentController.js";
import validateSchema from "../middleware/validateSchema.js";
import validateToken from "../middleware/validateToken.js";
import { commentCreateSchema, commentUpdateSchema } from "../validations/commentValidate.js";

const router = express.Router();

router.post("/", validateToken, validateSchema(commentCreateSchema), createComment);

router.get("/task/:taskId", validateToken, getTaskComments);

router.put("/:commentId", validateToken, validateSchema(commentUpdateSchema), updateComment);

router.delete("/:commentId", validateToken, deleteComment);

export default router;
