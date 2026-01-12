import { Schema, models, model } from "mongoose";

const designationSchema = new Schema(
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
  models.designations || model("designations", designationSchema);
