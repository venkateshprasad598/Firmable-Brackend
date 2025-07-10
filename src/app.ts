import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import registryRoutes from "./routes/registryRoutes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", registryRoutes);
app.use("/api/v1/health-check", (req: any, res: any) => {
  res.json({ message: "Hey I am up and working!!" });
});

export default app;
