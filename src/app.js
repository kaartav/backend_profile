import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config({ path: "./env" });

import cors from "cors";
import cookieParser from "cookie-parser";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter); //as we seperated router from controller we use "use" and when user askes for /user we call user router

export { app };
