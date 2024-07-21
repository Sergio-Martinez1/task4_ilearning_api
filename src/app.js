import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import { FRONT_URL } from "./config.js";

const app = express();

app.use(
  cors({
    origin: FRONT_URL,
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(indexRoutes);

app.use("/api", authRoutes);
app.use("/api", indexRoutes);

export default app;
