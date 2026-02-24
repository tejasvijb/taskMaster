// import type { JwtUserPayload } from "#/types/user.js";

import { JwtUserPayload, type PersistedUser } from "#/types/user.js";
import { type NextFunction, type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import { query } from "../config/dbConnection.js";
import { STATUS_CODES } from "../constants/index.js";

const validateToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.cookies.accessToken;

  if (!authToken) {
    res.status(STATUS_CODES.UNAUTHORIZED);
    throw new Error("User is not authorized or token is missing");
  }

  const token = authToken as string;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    res.status(STATUS_CODES.SERVER_ERROR);
    throw new Error("Internal server error: ACCESS_TOKEN_SECRET is not defined");
  }

  let decodedToken: { user: JwtUserPayload };
  try {
    decodedToken = jwt.verify(token, accessTokenSecret) as { user: JwtUserPayload };
  } catch {
    res.status(STATUS_CODES.UNAUTHORIZED);
    throw new Error("User is not authorized");
  }

  const result = await query<PersistedUser>('SELECT id, email, "firstname", "lastname", role FROM users WHERE id = $1', [decodedToken.user.id]);

  const dbUser = result.rows[0];
  if (!dbUser) {
    res.status(STATUS_CODES.UNAUTHORIZED);
    throw new Error("User is not authorized");
  }

  req.user = {
    email: dbUser.email,
    firstname: dbUser.firstname,
    id: dbUser.id,
    lastname: dbUser.lastname,
    role: dbUser.role,
  };

  next();
});

export default validateToken;
