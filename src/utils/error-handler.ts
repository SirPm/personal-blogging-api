import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { ApiError } from "../types/error";

export const errorHandler: ErrorRequestHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error?.statusCode || 500).json({
    message: error.message || "Internal server error",
  });
};

export const notFoundErrorHandler = (req: Request, res: Response) => {
  res.status(404).json({
    message: "Route does not exist!",
  });
};
