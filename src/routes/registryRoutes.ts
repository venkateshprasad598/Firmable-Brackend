import { Router } from "express";
import {
  getDistinctValues,
  getRegistryRecords,
  uploadXml,
} from "../controllers/registryController";

const router = Router();

router.post("/upload-xml", uploadXml);
router.post("/abn-records", getRegistryRecords);
router.get("/distinct", getDistinctValues);

export default router;
