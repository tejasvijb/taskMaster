import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { query } from "../config/dbConnection.js";
import { STATUS_CODES } from "../constants/index.js";
import { UserLoginType, UserProfileUpdateType, UserRegisterType } from "../validations/userValidate.js";
import { userRole } from "../validations/userValidate.js";

const TOKEN_EXPIRY = "15m";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, firstname, lastname, password } = req.body as UserRegisterType;

    // Check if user already exists
    const existingUser = await query("SELECT id FROM users WHERE email = $1", [normalizeEmail(email)]);

    if (existingUser.rows.length > 0) {
      res.status(STATUS_CODES.CONFLICT);
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const result = await query(
      "INSERT INTO users (email, firstname, lastname, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, firstname, lastname, role, created_at, updated_at",
      [normalizeEmail(email), firstname, lastname, hashedPassword, userRole.enum.user],
    );

    const user = result.rows[0];

    res.status(STATUS_CODES.CREATED).json({
      message: "User registered successfully",
      success: true,
      user: {
        created_at: user.created_at,
        email: user.email,
        firstname: user.firstname,
        id: user.id,
        lastname: user.lastname,
        role: user.role,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as UserLoginType;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!accessTokenSecret) {
      res.status(STATUS_CODES.SERVER_ERROR);
      throw new Error("Access token secret is not defined");
    }

    // Find user by email
    const result = await query("SELECT * FROM users WHERE email = $1", [normalizeEmail(email)]);

    if (result.rows.length === 0) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("Invalid email");
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("Invalid password");
    }

    // Create JWT token
    const payload = {
      email: user.email,
      firstname: user.firstname,
      id: user.id,
      lastname: user.lastname,
      role: user.role,
    };

    const accessToken = jwt.sign({ user: payload }, accessTokenSecret, {
      expiresIn: TOKEN_EXPIRY,
    });

    // Set cookie
    const cookieOptions = {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: "/",
      sameSite: process.env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
      secure: process.env.NODE_ENV === "production",
    };

    res.cookie("accessToken", accessToken, cookieOptions);

    res.status(STATUS_CODES.OK).json({
      message: "Logged in successfully",
      success: true,
      user: {
        created_at: user.created_at,
        email: user.email,
        firstname: user.firstname,
        id: user.id,
        lastname: user.lastname,
        role: user.role,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      path: "/",
      sameSite: process.env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
      secure: process.env.NODE_ENV === "production",
    };

    res.clearCookie("accessToken", cookieOptions);

    res.status(STATUS_CODES.OK).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar_url, bio, timezone } = req.body as UserProfileUpdateType;
    const userId = req.user?.id;

    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED);
      throw new Error("User not authenticated");
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const updateValues: unknown[] = [];
    let paramCount = 1;

    if (bio !== undefined) {
      updateFields.push(`bio = $${paramCount}`);
      updateValues.push(bio);
      paramCount++;
    }

    if (avatar_url !== undefined) {
      updateFields.push(`avatar_url = $${paramCount}`);
      updateValues.push(avatar_url);
      paramCount++;
    }

    if (timezone !== undefined) {
      updateFields.push(`timezone = $${paramCount}`);
      updateValues.push(timezone);
      paramCount++;
    }

    if (updateFields.length === 0) {
      res.status(STATUS_CODES.VALIDATION_ERROR);
      throw new Error("No fields to update");
    }

    // Add userId as the last parameter
    updateValues.push(userId);

    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(", ")}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING id, email, firstname, lastname, role, bio, avatar_url, timezone, created_at, updated_at
    `;


    const result = await query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      res.status(STATUS_CODES.NOT_FOUND);
      throw new Error("User not found");
    }

    const user = result.rows[0];

    res.status(STATUS_CODES.OK).json({
      message: "Profile updated successfully",
      success: true,
      user: {
        avatar_url: user.avatar_url,
        bio: user.bio,
        created_at: user.created_at,
        email: user.email,
        firstname: user.firstname,
        id: user.id,
        lastname: user.lastname,
        role: user.role,
        timezone: user.timezone,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};
