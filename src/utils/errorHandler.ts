/**
 * Standardized error responses for consistent API behavior
 * Generic messages to clients, detailed logging server-side
 */

import { Response } from "express";
import { logger } from "./logger";

export type ErrorCode =
  | "INVALID_INPUT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "SERVICE_UNAVAILABLE";

interface ErrorResponse {
  error: string;
  code?: ErrorCode;
  retryAfter?: number;
}

/**
 * Send standardized error response
 * Generic message to client, detailed logging server-side
 */
export const sendError = (
  res: Response,
  statusCode: number,
  clientMessage: string,
  code: ErrorCode,
  serverDetails?: any,
  retryAfter?: number
): void => {
  // Log detailed error server-side
  const level =
    statusCode >= 500
      ? "error"
      : statusCode >= 400
        ? "warn"
        : "info";

  logger[level](clientMessage, {
    statusCode,
    code,
    details: serverDetails,
    path: res.req?.path,
    ip: res.req?.ip,
  });

  // Send generic response to client
  const response: ErrorResponse = {
    error: clientMessage,
    code,
  };

  if (retryAfter) {
    response.retryAfter = retryAfter;
    res.setHeader("Retry-After", retryAfter.toString());
  }

  res.status(statusCode).json(response);
};

/**
 * Error handlers for common scenarios
 */

export const handleValidationError = (res: Response, message: string): void => {
  sendError(res, 400, "Invalid request parameters", "INVALID_INPUT", {
    message,
  });
};

export const handleAuthenticationError = (res: Response, message?: string): void => {
  sendError(res, 401, "Authentication required", "UNAUTHORIZED", {
    message: message || "Missing or invalid credentials",
  });
};

export const handleAuthorizationError = (res: Response): void => {
  sendError(res, 403, "You do not have permission to access this resource", "FORBIDDEN");
};

export const handleNotFoundError = (res: Response): void => {
  sendError(res, 404, "Resource not found", "NOT_FOUND");
};

export const handleRateLimitError = (
  res: Response,
  retryAfterSeconds: number
): void => {
  sendError(
    res,
    429,
    "Too many requests. Please try again later.",
    "RATE_LIMITED",
    {},
    retryAfterSeconds
  );
};

export const handleServerError = (
  res: Response,
  internalError: any,
  context?: string
): void => {
  const errorMessage =
    internalError instanceof Error
      ? internalError.message
      : String(internalError);

  sendError(
    res,
    500,
    "An error occurred while processing your request. Please try again later.",
    "SERVER_ERROR",
    {
      error: errorMessage,
      context,
      stack: process.env.NODE_ENV === "development" ? errorMessage : undefined,
    }
  );
};

export const handleServiceUnavailable = (res: Response, service: string): void => {
  sendError(res, 503, `Service temporarily unavailable (${service})`, "SERVICE_UNAVAILABLE", {
    service,
  });
};
