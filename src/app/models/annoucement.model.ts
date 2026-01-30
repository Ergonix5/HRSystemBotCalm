import { Schema, models, model, Types } from "mongoose";
import "./organization.model"

const annoucementSchema = new Schema(
  {
    //link annoucement to organization
    organization: {
      type: Types.ObjectId,
      ref: "organization",
      required: true,
    },

    annoucement_id: {
      type: String,
      required: true,
      trim: true, // e.g. ROLE_HR
    },

    title: {
      type: String,
      required: true,
      trim: true, // e.g. HR Manager
    },

    priority: {
      type: String,
      trim: true,
    },
    details_description: {
      type: String,
      trim: true,
    },

     expire_date: {
      type: String,
      trim: true,
    },

    // permissions from UI checkboxes
    
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

// role_id must be unique PER organization (not globally)
annoucementSchema.index({ organization: 1, annoucement_id: 1 }, { unique: true });

export const Annoucement = models.Annoucement || model("annoucement", annoucementSchema);
