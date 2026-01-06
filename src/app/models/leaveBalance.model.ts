import { model, models, Schema, Types } from "mongoose";
import "./employee.model";
import "./leaveType.model";


const leaveBalanceSchema = new Schema(
    {
        employee_id: {
            type: Types.ObjectId,
            ref: "employee",
            required: true,
        },

        leave_type_id: {
            type: Types.ObjectId,
            ref: "leaveType",
            required: true,
        },

        year: {
            type: Number,
            required: true,
        },

        allocated_days: {
            type: Number,
            // ref: "leaveType",
            required: true,
            default: 0
        },

        used_days: {
            type: Number,
            default: 0,
        },

        remaining_days: {
            type: Number,
            default: 0
        }

    },
    { timestamps: true }
);

leaveBalanceSchema.index(
    { employee_id: 1, leave_type_id: 1, year: 1 },
    { unique: true }
);

export const LeaveBalance = models.LeaveBalance || model("LeaveBalance", leaveBalanceSchema);