import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "https://task4ilearningclient-production.up.railway.app",
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
