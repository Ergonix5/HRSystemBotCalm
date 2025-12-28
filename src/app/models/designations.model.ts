import { Schema, models, model } from "mongoose";

const designationShema = new Schema(
  {
    designation_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const Designation =
  models.Designation || model("designations", designationShema);
