import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILog extends Document {
    userId: string;
    username: string; // composed of first_name + last_name
    role: string;
    orgId?: string;
    action: string;
    details: Record<string, any>;
    createdAt: Date;
}

const LogSchema: Schema<ILog> = new Schema(
    {
        userId: { type: String, required: true },
        username: { type: String, required: true },
        role: { type: String, required: true },
        orgId: { type: String },
        action: { type: String, required: true },
        details: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

const Log: Model<ILog> = mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);

export default Log;
