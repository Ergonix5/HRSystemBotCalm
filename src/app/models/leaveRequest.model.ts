import { Schema, model, models, Types } from 'mongoose';

import './organization.model';
import './employee.model';
import './leaveType.model';

const LeaveRequestSchema = new Schema({

    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true,
    },

    employee: {
        type: Types.ObjectId,
        ref: 'employee',
        required: true,
    },

    leave_type: {
        type: Types.ObjectId,
        ref: "leaveType",
        required: true,
    },

    start_date: {
        type: Date,
        required: true,
    },

    end_date: {
        type: Date,
        required: true,
    },

    total_days: {
        type: Number,
        required: true,
    },

    reason: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "cancelled"],
        default: "pending",
    },

    approver: {
        type: Types.ObjectId,
        ref: 'employee',
    },
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    }
);

export const LeaveRequest = models.LeaveRequest || model("leaveRequest", LeaveRequestSchema);