import { Request, Response, NextFunction } from "express";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

class Logger {
  private isDev = process.env.NODE_ENV !== "production";

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context } = entry;
    const levelUpper = level.toUpperCase().padEnd(5);
    const contextStr = context ? ` | ${JSON.stringify(context)}` : "";
    return `[${timestamp}] ${levelUpper} ${message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    const entry: LogEntry = { timestamp, level, message, context };
    const formatted = this.formatLog(entry);

    // Always log to console
    if (level === "error") {
      console.error(formatted);
    } else if (level === "warn") {
      console.warn(formatted);
    } else if (this.isDev && level === "debug") {
      console.debug(formatted);
    } else {
      console.log(formatted);
    }

    // TODO: In production, integrate with ELK/Datadog/CloudWatch
  }

  public info(message: string, context?: Record<string, any>): void {
    this.log("info", message, context);
  }

  public warn(message: string, context?: Record<string, any>): void {
    this.log("warn", message, context);
  }

  public error(message: string, context?: Record<string, any>): void {
    this.log("error", message, context);
  }

  public debug(message: string, context?: Record<string, any>): void {
    this.log("debug", message, context);
  }
}

export const logger = new Logger();

/**
 * Express middleware for logging HTTP requests
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Capture original res.json/send methods
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  let statusCode = 200;

  // Intercept response methods
  res.json = function (body: any) {
    statusCode = res.statusCode;
    return originalJson(body);
  };

  res.send = function (body: any) {
    statusCode = res.statusCode;
    return originalSend(body);
  };

  // Log when response is finished
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const level = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";

    if (level === "error") {
      logger.error(`${req.method} ${req.path}`, {
        statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get("user-agent")?.substring(0, 50),
      });
    } else if (level === "warn") {
      logger.warn(`${req.method} ${req.path}`, {
        statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get("user-agent")?.substring(0, 50),
      });
    } else {
      logger.info(`${req.method} ${req.path}`, {
        statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get("user-agent")?.substring(0, 50),
      });
    }
  });

  next();
};
