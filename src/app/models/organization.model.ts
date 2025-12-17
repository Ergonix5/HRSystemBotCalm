import { Schema, models, model } from "mongoose";

const organizationShema = new Schema({
  organization_id: { type: String },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
});

export const organization =models.organization || model("organizations",organizationShema);
