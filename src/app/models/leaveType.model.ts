import mongoose, { models, model, Schema, Types, mongo } from "mongoose";
import { Organization } from "./organization.model";



const leaveTypeSchemna = new Schema(
    {
        leave_type_id: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        anual_allocation: {
            type: Number,
            required: true,
            default: 0,
        }
    },
    { timestamps: true }
);


leaveTypeSchemna.index({ organization: 1, leave_type_id: 1 }, { unique: true });

export const LeaveType = models.LeaveType || model("leaveTypes", leaveTypeSchemna);