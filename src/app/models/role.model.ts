import { Schema, models, model } from "mongoose";

const roleSchema = new Schema(
  {
    role_id: {
      type: String,
      required: true,
      unique: true,
      trim: true, // e.g. ROLE_HR
    },

    role_name: {
      type: String,
      required: true,
      trim: true, // e.g. HR Manager
    },

    description: {
      type: String,
      trim: true,
    },

    // permissions from UI checkboxes
    permissions: {
      type: [String],
      default: [], // ["employee.read", "attendance.mark"]
    },
  },
  { timestamps: true }
);

export const Role = models.Role || model("roles", roleSchema);
