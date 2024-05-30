import { Request } from "express";
import { validationResult } from "express-validator";

export const getValidationResult = (req: Request): string | undefined => {
  const [validationError] = validationResult(req)
    .formatWith((error) => error.msg as string)
    .array({ onlyFirstError: true });
  return validationError;
};
