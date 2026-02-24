import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

import { STATUS_CODES } from "../constants/index.js";

/**
 * Validation middleware factory function
 * Validates request body against a provided Zod schema
 * @param schema - The Zod schema to validate against
 * @returns Express middleware function
 */
export const validateSchema = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(STATUS_CODES.VALIDATION_ERROR).json({
          errors: formattedErrors,
          message: "Validation failed",
          success: false,
        });
      }

      next(error);
    }
  };
};

export default validateSchema;
