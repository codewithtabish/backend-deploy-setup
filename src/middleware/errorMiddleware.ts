import { Request, Response, NextFunction } from "express";

// Custom error class for better error handling
class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message); // Call the parent constructor (Error)

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Distinguish between operational and programming errors

    // Capture the stack trace (good for debugging)
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error-handling middleware function
export const errorMiddleware = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If the error is an instance of AppError, keep its status code, otherwise set to 500 (server error)
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const status = err instanceof AppError ? err.status : "error";

  // Log the error stack in development (optional: can replace with a logger like Winston)
  console.error("ERROR 💥:", err.stack);

  // Send the error response to the client
  res.status(statusCode).json({
    status,
    message: err.message || "Something went wrong!",
  });
};

// Export the custom AppError class for use in your routes
export { AppError };
