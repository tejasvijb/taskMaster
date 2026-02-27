import { NextFunction, Request, Response } from "express";

import { query } from "../config/dbConnection.js";
import { STATUS_CODES } from "../constants/index.js";
import { TaskCreateType, TaskQueryType, TaskUpdateType } from "../validations/taskValidate.js";

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assigned_to, description, due_date, priority, status = "open", title } = req.body as TaskCreateType;
    const userId = req.user?.id;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Validate if assigned_to user exists (if provided)
    if (assigned_to) {
      const userExists = await query("SELECT id FROM users WHERE id = $1", [assigned_to]);
      if (userExists.rows.length === 0) {
        res.status(STATUS_CODES.VALIDATION_ERROR);
        throw new Error("Assigned user does not exist");
      }
    }

    // Insert task into database
    const result = await query(
      `INSERT INTO tasks (title, description, status, priority, due_date, assigned_to, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, description, status, priority, due_date, assigned_to, created_by, created_at, updated_at, completed_at`,
      [title, description || null, status, priority, due_date || null, assigned_to || null, userId],
    );

    const task = result.rows[0];

    res.status(STATUS_CODES.CREATED).json({
      message: "Task created successfully",
      success: true,
      task: {
        assigned_to: task.assigned_to,
        completed_at: task.completed_at,
        created_at: task.created_at,
        created_by: task.created_by,
        description: task.description,
        due_date: task.due_date,
        id: task.id,
        priority: task.priority,
        status: task.status,
        title: task.title,
        updated_at: task.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assignedTo, search, status } = req.query as Partial<Record<keyof TaskQueryType, string>>;
    const userId = req.user?.id;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Build dynamic query based on filters
    const whereConditions: string[] = [];
    const queryParams: unknown[] = [];
    let paramCount = 1;

    // Check if task is assigned to current user
    if (assignedTo === "me") {
      whereConditions.push(`assigned_to = $${paramCount}`);
      queryParams.push(userId);
      paramCount++;
    }

    // Filter by status
    if (status) {
      whereConditions.push(`status = $${paramCount}`);
      queryParams.push(status);
      paramCount++;
    }

    // Search by title or description
    if (search) {
      whereConditions.push(`(LOWER(title) LIKE LOWER($${paramCount}) OR LOWER(description) LIKE LOWER($${paramCount}))`);
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    // Build the WHERE clause
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    const result = await query(
      `SELECT id, title, description, status, priority, due_date, assigned_to, created_by, created_at, updated_at, completed_at
       FROM tasks
       ${whereClause}
       ORDER BY created_at DESC`,
      queryParams,
    );

    const tasks = result.rows.map((task) => ({
      assigned_to: task.assigned_to,
      completed_at: task.completed_at,
      created_at: task.created_at,
      created_by: task.created_by,
      description: task.description,
      due_date: task.due_date,
      id: task.id,
      priority: task.priority,
      status: task.status,
      title: task.title,
      updated_at: task.updated_at,
    }));

    res.status(STATUS_CODES.OK).json({
      message: "Tasks retrieved successfully",
      success: true,
      tasks,
      total: tasks.length,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { assigned_to, description, due_date, priority, status, title } = req.body as TaskUpdateType;
    const userId = req.user?.id;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Check if task exists and user is authorized to update it
    const taskExists = await query("SELECT created_by FROM tasks WHERE id = $1", [id]);

    if (taskExists.rows.length === 0) {
      res.status(STATUS_CODES.NOT_FOUND);
      throw new Error("Task not found");
    }

    // Only task creator can update it
    if (taskExists.rows[0].created_by !== userId) {
      res.status(STATUS_CODES.FORBIDDEN);
      throw new Error("You are not authorized to update this task");
    }

    // Validate if assigned_to user exists (if provided)
    if (assigned_to) {
      const userExists = await query("SELECT id FROM users WHERE id = $1", [assigned_to]);
      if (userExists.rows.length === 0) {
        res.status(STATUS_CODES.VALIDATION_ERROR);
        throw new Error("Assigned user does not exist");
      }
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const updateValues: unknown[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramCount}`);
      updateValues.push(title);
      paramCount++;
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      updateValues.push(description);
      paramCount++;
    }

    if (status !== undefined) {
      updateFields.push(`status = $${paramCount}`);
      updateValues.push(status);
      paramCount++;
    }

    if (priority !== undefined) {
      updateFields.push(`priority = $${paramCount}`);
      updateValues.push(priority);
      paramCount++;
    }

    if (due_date !== undefined) {
      updateFields.push(`due_date = $${paramCount}`);
      updateValues.push(due_date);
      paramCount++;
    }

    if (assigned_to !== undefined) {
      updateFields.push(`assigned_to = $${paramCount}`);
      updateValues.push(assigned_to);
      paramCount++;
    }

    if (updateFields.length === 0) {
      res.status(STATUS_CODES.VALIDATION_ERROR);
      throw new Error("No fields to update");
    }

    // Add task id as the last parameter
    updateValues.push(id);

    const updateQuery = `
      UPDATE tasks
      SET ${updateFields.join(", ")}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING id, title, description, status, priority, due_date, assigned_to, created_by, created_at, updated_at, completed_at
    `;

    const result = await query(updateQuery, updateValues);
    const task = result.rows[0];

    res.status(STATUS_CODES.OK).json({
      message: "Task updated successfully",
      success: true,
      task: {
        assigned_to: task.assigned_to,
        completed_at: task.completed_at,
        created_at: task.created_at,
        created_by: task.created_by,
        description: task.description,
        due_date: task.due_date,
        id: task.id,
        priority: task.priority,
        status: task.status,
        title: task.title,
        updated_at: task.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};
