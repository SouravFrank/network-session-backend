import winston from "winston";
import "winston-daily-rotate-file";

const fileRotateTransport = new (winston.transports as any).DailyRotateFile({
  filename: "application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "1m",
  maxFiles: "14d",
  zippedArchive: true,
  level: "info",
});

const errorRotateTransport = new (winston.transports as any).DailyRotateFile({
  filename: "error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "1m",
  maxFiles: "14d",
  zippedArchive: true,
  level: "error",
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    fileRotateTransport,
    errorRotateTransport,
  ],
});

// Add a stream property for morgan or other middleware
(logger as any).stream = {
  write: (message: string) => {
    console.log(message.trim());
  },
};

export default logger;
