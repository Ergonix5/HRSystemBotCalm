import { Schema, model, models, Types } from 'mongoose';

import './organization.model';
import './employee.model';

const AnnouncementSchema = new Schema({
    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true,
        index: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },

    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000,
    },

    author: {
        type: Types.ObjectId,
        ref: 'employee',
        required: true,
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
    },

    target: {
        type: String,
        enum: ['all', 'department', 'specific'],
        default: 'all',
    },

    // For department-specific announcements
    targetDepartments: [{
        type: Types.ObjectId,
        ref: 'designation', // Assuming departments are stored in designations
    }],

    // For specific employee announcements
    targetEmployees: [{
        type: Types.ObjectId,
        ref: 'employee',
    }],

    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
        index: true,
    },

    publishedAt: {
        type: Date,
        default: null,
    },

    expiresAt: {
        type: Date,
        default: null,
    },

    attachments: [{
        name: String,
        url: String,
        type: String,
    }],

    viewCount: {
        type: Number,
        default: 0,
    },

    notificationSent: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    }
);

// Indexes for efficient queries
AnnouncementSchema.index({ organization: 1, status: 1, created_at: -1 });
AnnouncementSchema.index({ organization: 1, publishedAt: -1 });
AnnouncementSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

export const Announcement = models.Announcement || model("announcement", AnnouncementSchema);
