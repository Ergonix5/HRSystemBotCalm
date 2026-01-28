import { Schema, model, models, Types } from 'mongoose';

import './organization.model';
import './employee.model';

const NotificationSchema = new Schema({
    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true,
        index: true,
    },

    recipient: {
        type: Types.ObjectId,
        ref: 'employee',
        required: true,
        index: true,
    },

    type: {
        type: String,
        enum: ['approval', 'rejection', 'reminder', 'system', 'announcement', 'alert'],
        required: true,
        index: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },

    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },

    metadata: {
        type: Schema.Types.Mixed,
        default: {},
        // Stores additional context like:
        // - leaveRequestId
        // - approverName
        // - actionUrl
        // - etc.
    },

    read: {
        type: Boolean,
        default: false,
        index: true,
    },

    readAt: {
        type: Date,
        default: null,
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },

    expiresAt: {
        type: Date,
        default: null,
    },

    emailSent: {
        type: Boolean,
        default: false,
    },

    emailSentAt: {
        type: Date,
        default: null,
    },
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    }
);

// Compound indexes for efficient queries
NotificationSchema.index({ recipient: 1, created_at: -1 });
NotificationSchema.index({ recipient: 1, read: 1, created_at: -1 });
NotificationSchema.index({ organization: 1, type: 1 });
NotificationSchema.index({ organization: 1, created_at: -1 });

// TTL index for automatic cleanup of expired notifications
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Notification = models.Notification || model("notification", NotificationSchema);
