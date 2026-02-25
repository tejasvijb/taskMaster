import { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "../constants/index.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  const stackTrace = process.env.NODE_ENV === "development" ? err.stack : null;

  switch (statusCode) {
    case STATUS_CODES.CONFLICT:
      res.status(statusCode).json({
        message: err.message,
        stackTrace,
        title: "Conflict",
      });
      break;

    case STATUS_CODES.FORBIDDEN:
      res.status(statusCode).json({
        message: err.message,
        stackTrace,
        title: "Forbidden",
      });
      break;

    case STATUS_CODES.NOT_FOUND:
      res.status(statusCode).json({
        message: err.message,
        stackTrace,
        title: "Not Found",
      });
      break;

    case STATUS_CODES.SERVER_ERROR:
      res.status(statusCode).json({
        message: err.message,
        stackTrace,
        title: "Server Error",
      });
      break;

    case STATUS_CODES.UNAUTHORIZED:
      res.status(statusCode).json({
        message: err.message,
        stackTrace,
        title: "Unauthorized",
      });
      break;

    case STATUS_CODES.VALIDATION_ERROR:
      res.status(statusCode).json({
        message: err.message,
        stackTrace,
        title: "Validation Failed",
      });
      break;

    default:
      res.status(statusCode).json({
        message: err.message,
        stackTrace,
        title: "Error",
      });
  }
}
