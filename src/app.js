import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/health", (req , res) => {
  res.status(200).json({
    status: "ok",
    message: "TeamFlow API running",
  });
});

export default app;
