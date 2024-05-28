import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { ApiError } from "../types/error";

export const errorHandler: ErrorRequestHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error?.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Internal server error",
    code: statusCode,
  });
};

export const notFoundErrorHandler = (req: Request, res: Response) => {
  res.status(404).json({
    message: "Route does not exist!",
    code: 404,
  });
};
