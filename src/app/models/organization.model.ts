import { Schema, models, model } from "mongoose";

const organizationSchema = new Schema({
  organization_id: { type: String },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
}, { timestamps: true }); // ✅ Also fixed typo and added timestamps

export const Organization = models.Organization || model("Organization", organizationSchema);
// ✅ Changed "Organizations" to "Organization" to match the ref
// ✅ Fixed typo: organizationShema → organizationSchema