import { Schema, model, models, Types, Document, Model, HydratedDocument } from 'mongoose';

import './employee.model';
import './organization.model';

// Preference settings for each notification type
interface NotificationTypePreference
{
    inApp: boolean;      // Show in-app notifications
    email: boolean;      // Send email notifications
}

// Interface for the notification preferences document structure
interface INotificationPreferences
{
    employee: Types.ObjectId;
    organization: Types.ObjectId;
    preferences: {
        [key: string]: { inApp: boolean; email: boolean };
        leaveApproval: { inApp: boolean; email: boolean };
        leaveRejection: { inApp: boolean; email: boolean };
        leaveSubmission: { inApp: boolean; email: boolean };
        leaveCancellation: { inApp: boolean; email: boolean };
        timesheetReminder: { inApp: boolean; email: boolean };
        leaveBalanceAlert: { inApp: boolean; email: boolean };
        upcomingLeaveReminder: { inApp: boolean; email: boolean };
        probationEnding: { inApp: boolean; email: boolean };
        systemAnnouncement: { inApp: boolean; email: boolean };
        birthdayNotification: { inApp: boolean; email: boolean };
        welcomeMessage: { inApp: boolean; email: boolean };
        generalAlert: { inApp: boolean; email: boolean };
    };
    globalSettings: {
        [key: string]: any;
        allNotifications: boolean;
        allEmails: boolean;
        frequency: 'immediate' | 'daily' | 'weekly';
        quietHours: {
            enabled: boolean;
            startTime: string;
            endTime: string;
        };
    };
    lastUpdated: Date;
}

// Interface for instance methods
interface INotificationPreferencesMethods
{
    getPreference(notificationType: string): NotificationTypePreference;
}

// Combined document interface using HydratedDocument
type INotificationPreferencesDocument = HydratedDocument<INotificationPreferences, INotificationPreferencesMethods>;

// Interface for static methods
interface INotificationPreferencesModel extends Model<INotificationPreferences, {}, INotificationPreferencesMethods>
{
    createDefaultPreferences(employeeId: string, organizationId: string): Promise<INotificationPreferencesDocument>;
    getOrCreate(employeeId: string, organizationId: string): Promise<INotificationPreferencesDocument | null>;
}

// Notification preferences schema
const NotificationPreferencesSchema = new Schema<INotificationPreferencesDocument, INotificationPreferencesModel>({
    employee: {
        type: Types.ObjectId,
        ref: 'employee',
        required: true,
        index: true,
    },

    organization: {
        type: Types.ObjectId,
        ref: 'organization',
        required: true,
        index: true,
    },

    // Preferences for each notification type
    preferences: {
        // Leave request notifications
        leaveApproval: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: true },
        },
        leaveRejection: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: true },
        },
        leaveSubmission: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: true },
        },
        leaveCancellation: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: false },
        },

        // Reminder notifications
        timesheetReminder: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: true },
        },
        leaveBalanceAlert: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: false },
        },
        upcomingLeaveReminder: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: true },
        },
        probationEnding: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: true },
        },

        // System notifications
        systemAnnouncement: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: true },
        },
        birthdayNotification: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: false },
        },
        welcomeMessage: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: true },
        },

        // General alerts
        generalAlert: {
            inApp: { type: Boolean, default: true },
            email: { type: Boolean, default: true },
        },
    },

    // Global settings
    globalSettings: {
        // Enable/disable all notifications
        allNotifications: {
            type: Boolean,
            default: true,
        },

        // Enable/disable all emails
        allEmails: {
            type: Boolean,
            default: true,
        },

        // Notification frequency (for future digest feature)
        frequency: {
            type: String,
            enum: ['immediate', 'daily', 'weekly'],
            default: 'immediate',
        },

        // Quiet hours (for future feature)
        quietHours: {
            enabled: { type: Boolean, default: false },
            startTime: { type: String, default: '22:00' }, // 10 PM
            endTime: { type: String, default: '08:00' },   // 8 AM
        },
    },

    // Last updated information
    lastUpdated: {
        type: Date,
        default: Date.now,
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
NotificationPreferencesSchema.index({ employee: 1, organization: 1 }, { unique: true });
NotificationPreferencesSchema.index({ organization: 1 });

// Method to get preference for a specific notification type
NotificationPreferencesSchema.methods.getPreference = function (notificationType: string): NotificationTypePreference
{
    const prefs = this.preferences[notificationType];
    if (!prefs)
    {
        // Return default if type not found
        return { inApp: true, email: true };
    }
    return {
        inApp: this.globalSettings.allNotifications && prefs.inApp,
        email: this.globalSettings.allEmails && prefs.email,
    };
};

// Static method to create default preferences for a new employee
NotificationPreferencesSchema.statics.createDefaultPreferences = async function (employeeId: string, organizationId: string)
{
    try
    {
        // Check if preferences already exist
        const existing = await this.findOne({
            employee: employeeId,
            organization: organizationId,
        });

        if (existing)
        {
            return existing;
        }

        // Create new preferences with defaults
        const preferences = await this.create({
            employee: employeeId,
            organization: organizationId,
            // All other fields will use schema defaults
        });

        return preferences;
    } catch (error)
    {
        console.error('Error creating default preferences:', error);
        throw error;
    }
};

// Static method to get or create preferences
NotificationPreferencesSchema.statics.getOrCreate = async function (employeeId: string, organizationId: string)
{
    let preferences = await this.findOne({
        employee: employeeId,
        organization: organizationId,
    });

    if (!preferences)
    {
        preferences = await this.createDefaultPreferences(employeeId, organizationId);
    }

    return preferences;
};

export const NotificationPreferences = (models.NotificationPreferences as INotificationPreferencesModel) ||
    model<INotificationPreferencesDocument, INotificationPreferencesModel>("notificationPreferences", NotificationPreferencesSchema);
