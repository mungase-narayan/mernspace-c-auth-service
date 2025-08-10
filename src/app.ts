import "reflect-metadata";
import cors from "cors";

import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import logger from "./config/logger";
import { HttpError } from "http-errors";

import authRouter from "./routes/auth";
import tenantRouter from "./routes/tenant";
import userRouter from "./routes/user";
import { Config } from "./config";

const app = express();
app.use(
  cors({
    origin: [Config.FRONTEND_URI!, "https://fudo.io"],
    credentials: true,
  }),
);
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

app.get("/", async (req, res) => {
  res.json({ message: "welcome to fudo apllication" });
});

app.use("/auth", authRouter);
app.use("/tenants", tenantRouter);
app.use("/users", userRouter);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error({ msg: err.message });
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: err.message,
        path: "",
        location: "",
      },
    ],
  });
});

export default app;
