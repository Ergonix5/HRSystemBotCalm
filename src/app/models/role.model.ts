import { Schema, models, model, Types } from "mongoose";

const roleSchema = new Schema(
  {
    //link role to organization
    organization: {
      type: Types.ObjectId,
      ref: "organizations",
      required: true,
    },

    role_id: {
      type: String,
      required: true,
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

// role_id must be unique PER organization (not globally)
roleSchema.index({ organization: 1, role_id: 1 }, { unique: true });

export const Role = models.Role || model("roles", roleSchema);
