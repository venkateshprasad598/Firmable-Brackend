import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import abnRoutes from "./routes/registryRoutes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", abnRoutes);
app.use("/api/health-check", (req: any, res: any) => {
  res.json({ message: "Hey I am up and working!!" });
});

export default app;
