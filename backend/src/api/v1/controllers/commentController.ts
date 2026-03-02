import { NextFunction, Request, Response } from "express";

import { query } from "../config/dbConnection.js";
import { STATUS_CODES } from "../constants/index.js";
import { CommentCreateType, CommentUpdateType } from "../validations/commentValidate.js";

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, task_id } = req.body as CommentCreateType;
    const userId = req.user?.id;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Verify task exists and user has access to it
    const taskExists = await query("SELECT id FROM tasks WHERE id = $1", [task_id]);
    if (taskExists.rows.length === 0) {
      res.status(STATUS_CODES.NOT_FOUND);
      throw new Error("Task not found");
    }

    // Insert comment into database
    const result = await query(
      `INSERT INTO comments (task_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, task_id, user_id, content, created_at, updated_at`,
      [task_id, userId, content],
    );

    const comment = result.rows[0];

    res.status(STATUS_CODES.CREATED).json({
      comment: {
        content: comment.content,
        created_at: comment.created_at,
        id: comment.id,
        task_id: comment.task_id,
        updated_at: comment.updated_at,
        user_id: comment.user_id,
      },
      message: "Comment created successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskComments = async (req: Request, res: Response, next: NextFunction) => {
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

    // Get all comments for the task
    const result = await query(
      `SELECT id, task_id, user_id, content, created_at, updated_at
       FROM comments
       WHERE task_id = $1
       ORDER BY created_at DESC`,
      [taskId],
    );

    const comments = result.rows.map((comment) => ({
      content: comment.content,
      created_at: comment.created_at,
      id: comment.id,
      task_id: comment.task_id,
      updated_at: comment.updated_at,
      user_id: comment.user_id,
    }));

    res.status(STATUS_CODES.OK).json({
      comments,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body as CommentUpdateType;
    const userId = req.user?.id;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Verify comment exists and user is the owner
    const commentExists = await query("SELECT user_id FROM comments WHERE id = $1", [commentId]);
    if (commentExists.rows.length === 0) {
      res.status(STATUS_CODES.NOT_FOUND);
      throw new Error("Comment not found");
    }

    if (commentExists.rows[0].user_id !== userId) {
      res.status(STATUS_CODES.FORBIDDEN);
      throw new Error("You can only edit your own comments");
    }

    // Update comment
    const result = await query(
      `UPDATE comments
       SET content = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, task_id, user_id, content, created_at, updated_at`,
      [content, commentId],
    );

    const comment = result.rows[0];

    res.status(STATUS_CODES.OK).json({
      comment: {
        content: comment.content,
        created_at: comment.created_at,
        id: comment.id,
        task_id: comment.task_id,
        updated_at: comment.updated_at,
        user_id: comment.user_id,
      },
      message: "Comment updated successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Verify comment exists and user is the owner
    const commentExists = await query("SELECT user_id FROM comments WHERE id = $1", [commentId]);
    if (commentExists.rows.length === 0) {
      res.status(STATUS_CODES.NOT_FOUND);
      throw new Error("Comment not found");
    }

    if (commentExists.rows[0].user_id !== userId) {
      res.status(STATUS_CODES.FORBIDDEN);
      throw new Error("You can only delete your own comments");
    }

    // Delete comment
    await query("DELETE FROM comments WHERE id = $1", [commentId]);

    res.status(STATUS_CODES.OK).json({
      message: "Comment deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
