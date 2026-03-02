import express from "express";

import { deleteAttachment, getAttachmentById, getTaskAttachments, uploadAttachment } from "../controllers/attachmentController.js";
import validateSchema from "../middleware/validateSchema.js";
import validateToken from "../middleware/validateToken.js";
import { attachmentCreateSchema } from "../validations/attachmentValidate.js";

const router = express.Router();

router.post("/", validateToken, validateSchema(attachmentCreateSchema), uploadAttachment);

router.get("/task/:taskId", validateToken, getTaskAttachments);

router.get("/:attachmentId", validateToken, getAttachmentById);

router.delete("/:attachmentId", validateToken, deleteAttachment);

export default router;
