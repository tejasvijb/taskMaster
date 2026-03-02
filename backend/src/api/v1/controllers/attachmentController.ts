import { NextFunction, Request, Response } from "express";

import { query } from "../config/dbConnection.js";
import { STATUS_CODES } from "../constants/index.js";
import { AttachmentCreateType } from "../validations/attachmentValidate.js";

export const uploadAttachment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { file_name, file_size, file_url, mime_type, task_id } = req.body as AttachmentCreateType;
    const userId = req.user?.id;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Verify task exists
    const taskExists = await query("SELECT id FROM tasks WHERE id = $1", [task_id]);
    if (taskExists.rows.length === 0) {
      res.status(STATUS_CODES.NOT_FOUND);
      throw new Error("Task not found");
    }

    // Insert attachment into database
    const result = await query(
      `INSERT INTO attachments (task_id, uploaded_by, file_name, file_url, file_size, mime_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, task_id, uploaded_by, file_name, file_url, file_size, mime_type, created_at, updated_at`,
      [task_id, userId, file_name, file_url, file_size, mime_type],
    );

    const attachment = result.rows[0];

    res.status(STATUS_CODES.CREATED).json({
      attachment: {
        created_at: attachment.created_at,
        file_name: attachment.file_name,
        file_size: attachment.file_size,
        file_url: attachment.file_url,
        id: attachment.id,
        mime_type: attachment.mime_type,
        task_id: attachment.task_id,
        updated_at: attachment.updated_at,
        uploaded_by: attachment.uploaded_by,
      },
      message: "Attachment uploaded successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskAttachments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Verify task exists
    const taskExists = await query("SELECT id FROM tasks WHERE id = $1", [taskId]);
    if (taskExists.rows.length === 0) {
      res.status(STATUS_CODES.NOT_FOUND);
      throw new Error("Task not found");
    }

    // Get all attachments for the task
    const result = await query(
      `SELECT id, task_id, uploaded_by, file_name, file_url, file_size, mime_type, created_at, updated_at
       FROM attachments
       WHERE task_id = $1
       ORDER BY created_at DESC`,
      [taskId],
    );

    const attachments = result.rows.map((attachment) => ({
      created_at: attachment.created_at,
      file_name: attachment.file_name,
      file_size: attachment.file_size,
      file_url: attachment.file_url,
      id: attachment.id,
      mime_type: attachment.mime_type,
      task_id: attachment.task_id,
      updated_at: attachment.updated_at,
      uploaded_by: attachment.uploaded_by,
    }));

    res.status(STATUS_CODES.OK).json({
      attachments,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getAttachmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { attachmentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Get attachment details
    const result = await query(
      `SELECT id, task_id, uploaded_by, file_name, file_url, file_size, mime_type, created_at, updated_at
       FROM attachments
       WHERE id = $1`,
      [attachmentId],
    );

    if (result.rows.length === 0) {
      res.status(STATUS_CODES.NOT_FOUND);
      throw new Error("Attachment not found");
    }

    const attachment = result.rows[0];

    res.status(STATUS_CODES.OK).json({
      attachment: {
        created_at: attachment.created_at,
        file_name: attachment.file_name,
        file_size: attachment.file_size,
        file_url: attachment.file_url,
        id: attachment.id,
        mime_type: attachment.mime_type,
        task_id: attachment.task_id,
        updated_at: attachment.updated_at,
        uploaded_by: attachment.uploaded_by,
      },
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAttachment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { attachmentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Verify attachment exists and user is the uploader
    const attachmentExists = await query("SELECT uploaded_by FROM attachments WHERE id = $1", [attachmentId]);
    if (attachmentExists.rows.length === 0) {
      res.status(STATUS_CODES.NOT_FOUND);
      throw new Error("Attachment not found");
    }

    if (attachmentExists.rows[0].uploaded_by !== userId) {
      res.status(STATUS_CODES.FORBIDDEN);
      throw new Error("You can only delete your own attachments");
    }

    // Delete attachment
    await query("DELETE FROM attachments WHERE id = $1", [attachmentId]);

    res.status(STATUS_CODES.OK).json({
      message: "Attachment deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
