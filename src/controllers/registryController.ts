import fs from "fs";
import path from "path";
import { parseABNXml } from "../utils/xmlParser";
import { ABNRecord } from "../models/ABNRecord";

const BATCH_SIZE = 100;

export const uploadXml = async (req: any, res: any) => {
  try {
    const xmlFilePath = path.join(__dirname, "../../data/test.xml");
    const xmlData = fs.readFileSync(xmlFilePath, "utf-8");

    const parsedData = await parseABNXml(xmlData);

    console.log({ parsedData });
    await ABNRecord.deleteMany({});

    for (let i = 0; i < parsedData.length; i += BATCH_SIZE) {
      const chunk = parsedData.slice(i, i + BATCH_SIZE);
      await ABNRecord.insertMany(chunk);
    }

    res
      .status(200)
      .json({ message: "Data inserted in chunks", count: parsedData.length });
  } catch (err) {
    console.error("Parsing or DB insert error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRegistryRecords = async (req: any, res: any) => {
  try {
    const {
      status = [],
      state = [],
      gstStatus = [],
      entityType = [],
      search,
      lastUpdatedDate,
      page = 1,
      limit = 10,
      sortBy = "recordLastUpdatedDate",
      sortOrder = "desc",
    } = req.body;

    const filters: any = {};

    if (Array.isArray(status) && status.length > 0) {
      filters.status = { $in: status };
    }

    if (Array.isArray(state) && state.length > 0) {
      filters.state = { $in: state };
    }

    if (Array.isArray(gstStatus) && gstStatus.length > 0) {
      filters.gstStatus = { $in: gstStatus };
    }

    if (Array.isArray(entityType) && entityType.length > 0) {
      filters["entityType.ind"] = { $in: entityType };
    }

    if (search && typeof search === "string") {
      filters.$or = [
        { abn: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    if (lastUpdatedDate) {
      const from = Number(lastUpdatedDate);
      const to = Date.now();

      if (!isNaN(from)) {
        filters.recordLastUpdatedDate = {
          $gte: from,
          $lte: to,
        };
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = {};
    if (sortBy) {
      if (sortBy == "entityType") {
        sort["entityType.text"] = sortOrder === "asc" ? 1 : -1;
      } else {
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;
      }
    }

    const [records, total] = await Promise.all([
      ABNRecord.find(filters).sort(sort).skip(skip).limit(Number(limit)),
      ABNRecord.countDocuments(filters),
    ]);

    res.status(200).json({
      data: records,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDistinctValues = async (req: any, res: any) => {
  const { field } = req.query;

  if (!field) {
    return res.status(400).json({
      status: "error",
      message: "Missing `field` query parameter",
    });
  }

  try {
    const distinctValues = await ABNRecord.distinct(field as string);
    res.status(200).json({
      status: "success",
      field,
      data: distinctValues,
    });
  } catch (error) {
    console.error(`Error fetching distinct values for field: ${field}`, error);
    res.status(500).json({
      status: "error",
      message: `Failed to fetch distinct values for field: ${field}`,
    });
  }
};
