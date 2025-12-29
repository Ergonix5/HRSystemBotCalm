import { Schema, models, model, Types } from "mongoose";
import "./organization.model";
import "./designations.model";
import "./role.model";

const employeeSchema = new Schema(
  {
    organization: {
      type: Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    designation: {
      type: Types.ObjectId,
      ref: "designations",
      required: true,
      index: true,
    },

    role: {
      type: Types.ObjectId,
      ref: "roles",
      required: true,
      index: true,
    },
    
    employee_id: {
      type:String,
      required: true,
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
      trim: true,
      lowercase: true,
      index: true,
      // simple email pattern (good enough for validation layer too)
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },

    // store ONLY hashed password (never plain password)
    hash_password: {
      type: String,
      required: true,
      minlength: 20, // bcrypt hashes are longer; just a safety check
      select: false, // do not return in queries by default
    },

    phone: {
      type: String,
      trim: true,
      // optional: basic phone validation
      match: [/^\+?[0-9]{7,15}$/, "Invalid phone number"],
    },

    date_of_birth: {
      type: Date,
    },

    join_date: {
      type: Date,
      default: Date.now,
    },

    employment_status: {
      type: String,
      enum: ["active", "inactive", "terminated", "resigned", "on_leave"],
      default: "active",
      index: true,
    },

    address: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

// Unique email per organization (multi-tenant)
employeeSchema.index({ organization: 1, email: 1 }, { unique: true });

//  Helpful indexes (optional but good)
employeeSchema.index({ organization: 1, role: 1 });
employeeSchema.index({ organization: 1, designation: 1 });

export const Employee = models.Employee || model("employees", employeeSchema);
