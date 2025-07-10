import mongoose from "mongoose";

const ABNSchema = new mongoose.Schema({
  abn: String,
  status: String,
  statusFromDate: Number,
  entityType: {
    ind: String,
    text: String,
  },
  name: String,
  //   nameType: String,
  state: String,
  postcode: String,
  gstStatus: String,
  //   gstFromDate: String,
  recordLastUpdatedDate: Number,
  //   replaced: String,
});

export const ABNRecord = mongoose.model("ABNRecord", ABNSchema);
