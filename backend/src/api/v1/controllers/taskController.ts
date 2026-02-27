import { NextFunction, Request, Response } from "express";

import { query } from "../config/dbConnection.js";
import { STATUS_CODES } from "../constants/index.js";
import { TaskCreateType, TaskQueryType } from "../validations/taskValidate.js";

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
