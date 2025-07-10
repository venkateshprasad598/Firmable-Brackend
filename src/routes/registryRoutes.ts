import { Router } from "express";
import {
  exportRegistryRecords,
  getDistinctValues,
  getRegistryRecords,
  uploadXml,
} from "../controllers/registryController";

const router = Router();

router.post("/upload-xml", uploadXml);
router.post("/registry-records", getRegistryRecords);
router.post("/export-records", exportRegistryRecords);
router.get("/distinct", getDistinctValues);

export default router;
