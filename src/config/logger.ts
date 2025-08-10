import winston from "winston";
import { Config } from ".";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "blue",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "DD MMM, YYYY - HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
  ),
);

const logger = winston.createLogger({
  level: "debug",
  levels,
  defaultMeta: { serviceName: "auth-service" },
  format,
  transports: [
    new winston.transports.File({
      dirname: "logs",
      filename: "combined.log",
      level: "info",
      format,
      silent: Config.NODE_ENV === "test",
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "errors.log",
      level: "error",
      format,
      silent: Config.NODE_ENV === "test",
    }),
    new winston.transports.Console({
      level: "debug",
      format,
      silent: Config.NODE_ENV === "test",
    }),
  ],
});

export default logger;
