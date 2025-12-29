import { Schema, model, models } from "mongoose";

const candidateSchema = new Schema(
  {
    candidate_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    first_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    last_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 15,
    },

    current_position: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    experience_years: {
      type: Number,
      min: 0,
      max: 50,
      default: 0,
    },

    skills: {
      type: [String], // e.g. ["React", "Node.js", "MongoDB"]
      default: [],
      index: true,
    },

    source: {
      type: String,
      enum: [
        "LinkedIn",
        "Indeed",
        "Referral",
        "Company Website",
        "Email",
        "Other",
      ],
      default: "Other",
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Screening",
        "Interview",
        "Technical Test",
        "Offer",
        "Hired",
        "Rejected",
        "On Hold",
      ],
      default: "Applied",
      index: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true, 
  }
);

export const Candidate =
  models.Candidate || model("Candidate", candidateSchema);
