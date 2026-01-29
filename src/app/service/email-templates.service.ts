// 
// Email Templates Service
// Provides HTML email templates for various notification types
// 

interface EmailTemplateData
{
    recipientName: string;
    actionUrl?: string;
    [key: string]: any;
}

interface EmailTemplate
{
    subject: string;
    html: string;
}

// Base email template wrapper
function createEmailTemplate(title: string, content: string, actionUrl?: string, actionText: string = 'View Details'): string
{
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .email-header {
                    background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
                    color: #ffffff;
                    padding: 30px 20px;
                    text-align: center;
                }
                .email-header h1 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                }
                .email-body {
                    padding: 30px 20px;
                }
                .email-content {
                    background-color: #F9FAFB;
                    border-left: 4px solid #4F46E5;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 4px;
                }
                .button {
                    display: inline-block;
                    padding: 14px 28px;
                    background-color: #4F46E5;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 20px 0;
                    font-weight: 600;
                    transition: background-color 0.3s;
                }
                .button:hover {
                    background-color: #4338CA;
                }
                .email-footer {
                    background-color: #F9FAFB;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #6B7280;
                    border-top: 1px solid #E5E7EB;
                }
                .divider {
                    height: 1px;
                    background-color: #E5E7EB;
                    margin: 20px 0;
                }
                .info-box {
                    background-color: #EFF6FF;
                    border: 1px solid #BFDBFE;
                    padding: 15px;
                    border-radius: 6px;
                    margin: 15px 0;
                }
                .warning-box {
                    background-color: #FEF3C7;
                    border: 1px solid #FCD34D;
                    padding: 15px;
                    border-radius: 6px;
                    margin: 15px 0;
                }
                .success-box {
                    background-color: #D1FAE5;
                    border: 1px solid #6EE7B7;
                    padding: 15px;
                    border-radius: 6px;
                    margin: 15px 0;
                }
                .error-box {
                    background-color: #FEE2E2;
                    border: 1px solid #FCA5A5;
                    padding: 15px;
                    border-radius: 6px;
                    margin: 15px 0;
                }
                @media only screen and (max-width: 600px) {
                    .email-container {
                        margin: 0;
                        border-radius: 0;
                    }
                    .email-body {
                        padding: 20px 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>🏢 SOLID-HR-System</h1>
                </div>
                <div class="email-body">
                    ${content}
                    ${actionUrl ? `
                        <div style="text-align: center;">
                            <a href="${actionUrl}" class="button">${actionText}</a>
                        </div>
                    ` : ''}
                </div>
                <div class="email-footer">
                    <p><strong>SOLID-HR-System</strong></p>
                    <p>This is an automated notification. Please do not reply to this email.</p>
                    <p>© ${new Date().getFullYear()} SOLID-HR-System. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Leave Request Approval Email
export function leaveRequestApprovalEmail(data: EmailTemplateData & {
    leaveType: string;
    startDate: string;
    endDate: string;
    approverName: string;
    days: number;
}): EmailTemplate
{
    const content = `
        <h2 style="color: #10B981; margin-top: 0;">✅ Leave Request Approved</h2>
        <p>Hi ${data.recipientName},</p>
        <p>Great news! Your leave request has been approved.</p>
        
        <div class="success-box">
            <p style="margin: 0;"><strong>Leave Type:</strong> ${data.leaveType}</p>
            <p style="margin: 5px 0 0 0;"><strong>Duration:</strong> ${data.startDate} to ${data.endDate} (${data.days} day${data.days > 1 ? 's' : ''})</p>
            <p style="margin: 5px 0 0 0;"><strong>Approved By:</strong> ${data.approverName}</p>
        </div>
        
        <p>Your leave has been added to the calendar. Enjoy your time off!</p>
    `;

    return {
        subject: `✅ Leave Request Approved - ${data.leaveType}`,
        html: createEmailTemplate('Leave Request Approved', content, data.actionUrl, 'View Leave Details')
    };
}

// Leave Request Rejection Email
export function leaveRequestRejectionEmail(data: EmailTemplateData & {
    leaveType: string;
    startDate: string;
    endDate: string;
    reason?: string;
}): EmailTemplate
{
    const content = `
        <h2 style="color: #EF4444; margin-top: 0;">❌ Leave Request Rejected</h2>
        <p>Hi ${data.recipientName},</p>
        <p>We regret to inform you that your leave request has been rejected.</p>
        
        <div class="error-box">
            <p style="margin: 0;"><strong>Leave Type:</strong> ${data.leaveType}</p>
            <p style="margin: 5px 0 0 0;"><strong>Requested Duration:</strong> ${data.startDate} to ${data.endDate}</p>
            ${data.reason ? `<p style="margin: 5px 0 0 0;"><strong>Reason:</strong> ${data.reason}</p>` : ''}
        </div>
        
        <p>If you have any questions or would like to discuss this further, please contact your manager or HR department.</p>
    `;

    return {
        subject: `❌ Leave Request Rejected - ${data.leaveType}`,
        html: createEmailTemplate('Leave Request Rejected', content, data.actionUrl, 'View Details')
    };
}

// Timesheet Reminder Email
export function timesheetReminderEmail(data: EmailTemplateData & {
    dueDate: string;
    period: string;
}): EmailTemplate
{
    const content = `
        <h2 style="color: #F59E0B; margin-top: 0;">⏰ Timesheet Reminder</h2>
        <p>Hi ${data.recipientName},</p>
        <p>This is a friendly reminder to submit your timesheet for the current pay period.</p>
        
        <div class="warning-box">
            <p style="margin: 0;"><strong>Period:</strong> ${data.period}</p>
            <p style="margin: 5px 0 0 0;"><strong>Due Date:</strong> ${data.dueDate}</p>
        </div>
        
        <p>Please ensure your timesheet is submitted by the due date to avoid any delays in payroll processing.</p>
    `;

    return {
        subject: '⏰ Timesheet Submission Reminder',
        html: createEmailTemplate('Timesheet Reminder', content, data.actionUrl, 'Submit Timesheet')
    };
}

// System Announcement Email
export function systemAnnouncementEmail(data: EmailTemplateData & {
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
}): EmailTemplate
{
    const priorityColors: Record<string, string> = {
        low: '#6B7280',
        medium: '#3B82F6',
        high: '#F59E0B',
        urgent: '#EF4444'
    };

    const priorityLabels: Record<string, string> = {
        low: 'Info',
        medium: 'Important',
        high: 'High Priority',
        urgent: 'Urgent'
    };

    const content = `
        <h2 style="color: ${priorityColors[data.priority]}; margin-top: 0;">📢 ${data.title}</h2>
        <p>Hi ${data.recipientName},</p>
        
        <div class="info-box">
            <p style="margin: 0;"><strong>Priority:</strong> <span style="color: ${priorityColors[data.priority]};">${priorityLabels[data.priority]}</span></p>
        </div>
        
        <div class="email-content">
            <p>${data.message}</p>
        </div>
        
        <p>Please read this announcement carefully and take any necessary action.</p>
    `;

    return {
        subject: `📢 ${priorityLabels[data.priority]}: ${data.title}`,
        html: createEmailTemplate(data.title, content, data.actionUrl, 'Read More')
    };
}

// Welcome Email for New Employees
export function welcomeEmail(data: EmailTemplateData & {
    companyName: string;
    startDate: string;
    managerName?: string;
}): EmailTemplate
{
    const content = `
        <h2 style="color: #10B981; margin-top: 0;">🎉 Welcome to ${data.companyName}!</h2>
        <p>Hi ${data.recipientName},</p>
        <p>We're thrilled to have you join our team! Welcome aboard!</p>
        
        <div class="success-box">
            <p style="margin: 0;"><strong>Start Date:</strong> ${data.startDate}</p>
            ${data.managerName ? `<p style="margin: 5px 0 0 0;"><strong>Your Manager:</strong> ${data.managerName}</p>` : ''}
        </div>
        
        <h3>Getting Started</h3>
        <p>Here are a few things to help you get started:</p>
        <ul>
            <li>Complete your employee profile</li>
            <li>Review company policies and procedures</li>
            <li>Set up your notification preferences</li>
            <li>Familiarize yourself with the HR portal</li>
        </ul>
        
        <p>If you have any questions, don't hesitate to reach out to your manager or the HR department.</p>
        <p>We look forward to working with you!</p>
    `;

    return {
        subject: `🎉 Welcome to ${data.companyName}!`,
        html: createEmailTemplate(`Welcome to ${data.companyName}`, content, data.actionUrl, 'Access HR Portal')
    };
}

// Probation Period Ending Email
export function probationEndingEmail(data: EmailTemplateData & {
    employeeName: string;
    endDate: string;
    joinDate: string;
}): EmailTemplate
{
    const content = `
        <h2 style="color: #F59E0B; margin-top: 0;">⏰ Probation Period Ending</h2>
        <p>Hi ${data.recipientName},</p>
        <p>This is a notification that an employee's probation period is ending soon.</p>
        
        <div class="warning-box">
            <p style="margin: 0;"><strong>Employee:</strong> ${data.employeeName}</p>
            <p style="margin: 5px 0 0 0;"><strong>Join Date:</strong> ${data.joinDate}</p>
            <p style="margin: 5px 0 0 0;"><strong>Probation End Date:</strong> ${data.endDate}</p>
        </div>
        
        <h3>Action Required</h3>
        <p>Please schedule a performance review and prepare the confirmation documentation.</p>
        <ul>
            <li>Review employee performance</li>
            <li>Prepare feedback and assessment</li>
            <li>Schedule confirmation meeting</li>
            <li>Update employee status in the system</li>
        </ul>
    `;

    return {
        subject: `⏰ Probation Period Ending - ${data.employeeName}`,
        html: createEmailTemplate('Probation Period Ending', content, data.actionUrl, 'View Employee Profile')
    };
}

// Birthday Notification Email (Optional - usually in-app only)
export function birthdayEmail(data: EmailTemplateData & {
    birthdayPersonName: string;
}): EmailTemplate
{
    const content = `
        <h2 style="color: #EC4899; margin-top: 0;">🎂 Birthday Celebration!</h2>
        <p>Hi ${data.recipientName},</p>
        <p>Today is a special day!</p>
        
        <div class="success-box" style="background-color: #FCE7F3; border-color: #F9A8D4; text-align: center;">
            <h3 style="margin: 0; color: #EC4899;">🎉 Happy Birthday ${data.birthdayPersonName}! 🎉</h3>
            <p style="margin: 10px 0 0 0;">Wishing you a wonderful day filled with joy and happiness!</p>
        </div>
        
        <p>Let's make their day special by sending them your warm wishes!</p>
    `;

    return {
        subject: `🎂 Birthday Celebration - ${data.birthdayPersonName}`,
        html: createEmailTemplate('Birthday Celebration', content)
    };
}

// Leave Balance Alert Email
export function leaveBalanceAlertEmail(data: EmailTemplateData & {
    leaveType: string;
    remainingDays: number;
    totalDays: number;
    year: number;
}): EmailTemplate
{
    const percentageUsed = ((data.totalDays - data.remainingDays) / data.totalDays) * 100;
    const isLow = data.remainingDays <= 5;

    const content = `
        <h2 style="color: ${isLow ? '#F59E0B' : '#3B82F6'}; margin-top: 0;">📊 Leave Balance Update</h2>
        <p>Hi ${data.recipientName},</p>
        <p>Here's your current leave balance for ${data.year}:</p>
        
        <div class="${isLow ? 'warning-box' : 'info-box'}">
            <p style="margin: 0;"><strong>Leave Type:</strong> ${data.leaveType}</p>
            <p style="margin: 5px 0 0 0;"><strong>Remaining Days:</strong> ${data.remainingDays} of ${data.totalDays}</p>
            <p style="margin: 5px 0 0 0;"><strong>Used:</strong> ${Math.round(percentageUsed)}%</p>
        </div>
        
        ${isLow ? `
            <p><strong>⚠️ Note:</strong> You have limited leave days remaining. Plan your time off accordingly.</p>
        ` : `
            <p>Remember to use your leave days throughout the year to maintain a healthy work-life balance.</p>
        `}
    `;

    return {
        subject: `📊 Leave Balance Update - ${data.leaveType}`,
        html: createEmailTemplate('Leave Balance Update', content, data.actionUrl, 'View Leave Details')
    };
}

// Upcoming Leave Reminder Email
export function upcomingLeaveReminderEmail(data: EmailTemplateData & {
    leaveType: string;
    startDate: string;
    endDate: string;
    days: number;
}): EmailTemplate
{
    const content = `
        <h2 style="color: #3B82F6; margin-top: 0;">📅 Upcoming Leave Reminder</h2>
        <p>Hi ${data.recipientName},</p>
        <p>This is a reminder that your approved leave is coming up soon.</p>
        
        <div class="info-box">
            <p style="margin: 0;"><strong>Leave Type:</strong> ${data.leaveType}</p>
            <p style="margin: 5px 0 0 0;"><strong>Start Date:</strong> ${data.startDate}</p>
            <p style="margin: 5px 0 0 0;"><strong>End Date:</strong> ${data.endDate}</p>
            <p style="margin: 5px 0 0 0;"><strong>Duration:</strong> ${data.days} day${data.days > 1 ? 's' : ''}</p>
        </div>
        
        <h3>Before You Go</h3>
        <ul>
            <li>Complete any pending tasks</li>
            <li>Set up out-of-office notifications</li>
            <li>Brief your team on ongoing projects</li>
            <li>Ensure all handovers are complete</li>
        </ul>
        
        <p>Have a great time off!</p>
    `;

    return {
        subject: `📅 Upcoming Leave Reminder - ${data.leaveType}`,
        html: createEmailTemplate('Upcoming Leave Reminder', content, data.actionUrl, 'View Leave Details')
    };
}

// Export all templates
export const EmailTemplates = {
    leaveRequestApproval: leaveRequestApprovalEmail,
    leaveRequestRejection: leaveRequestRejectionEmail,
    timesheetReminder: timesheetReminderEmail,
    systemAnnouncement: systemAnnouncementEmail,
    welcome: welcomeEmail,
    probationEnding: probationEndingEmail,
    birthday: birthdayEmail,
    leaveBalanceAlert: leaveBalanceAlertEmail,
    upcomingLeaveReminder: upcomingLeaveReminderEmail,
};
