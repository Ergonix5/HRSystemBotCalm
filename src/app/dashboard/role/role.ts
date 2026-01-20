import { type Permission } from '@/src/app/types/types';

export const availablePermissions: Permission[] = [

  // Dashboard Permissions
  { id: 'dashboard.view', name: 'View Dashboard', description: 'View dashboard information', category: 'Dashboard' },
  // Employee Permissions
  { id: 'employees.view', name: 'View Employees', description: 'View employee information', category: 'Employee' },
  { id: 'employees.create', name: 'Create Employees', description: 'Add new employees', category: 'Employee' },
  { id: 'employees.edit', name: 'Edit Employees', description: 'Modify employee details', category: 'Employee' },
  { id: 'employees.delete', name: 'Delete Employees', description: 'Remove employees', category: 'Employee' },

  // Announcement Permissions
  { id: 'announcement.view', name: 'View Announcements', description: 'View company announcements', category: 'Announcement' },
  { id: 'announcement.create', name: 'Create Announcements', description: 'Post new announcements', category: 'Announcement' },
  { id: 'announcement.edit', name: 'Edit Announcements', description: 'Modify announcements', category: 'Announcement' },
  { id: 'announcement.delete', name: 'Delete Announcements', description: 'Remove announcements', category: 'Announcement' },


  // Reports
  { id: 'reports.view', name: 'View Reports', description: 'Access system reports', category: 'Reports' },
  { id: 'reports.export', name: 'Export Reports', description: 'Download report data', category: 'Reports' },
  { id: 'logs.view', name: 'View System Logs', description: 'Access activity logs', category: 'Reports' },

  // Role Permissions
  { id: 'roles.view', name: 'View Roles', description: 'View roles and permissions', category: 'Role' },
  { id: 'roles.create', name: 'Create Roles', description: 'Create new roles', category: 'Role' },
  { id: 'roles.edit', name: 'Edit Roles', description: 'Modify existing roles', category: 'Role' },
  { id: 'roles.delete', name: 'Delete Roles', description: 'Remove roles', category: 'Role' },

  // Company Permissions
  { id: 'companies.view', name: 'View Companies', description: 'View company information', category: 'Company' },
  { id: 'companies.create', name: 'Create Companies', description: 'Add new companies', category: 'Company' },
  { id: 'companies.edit', name: 'Edit Companies', description: 'Modify company details', category: 'Company' },
  { id: 'companies.delete', name: 'Delete Companies', description: 'Remove companies', category: 'Company' },

  // Designation Permissions
  { id: 'designations.view', name: 'View Designations', description: 'View designation list', category: 'Designation' },
  { id: 'designations.create', name: 'Create Designations', description: 'Add new designations', category: 'Designation' },
  { id: 'designations.edit', name: 'Edit Designations', description: 'Modify existing designations', category: 'Designation' },
  { id: 'designations.delete', name: 'Delete Designations', description: 'Remove designations', category: 'Designation' },

  // Leave Management Permissions
{ id: 'leave.view', name: 'View Leave Requests', description: 'View leave applications', category: 'Leave' },
{ id: 'leave.create', name: 'Create Leave Requests', description: 'Submit new leave requests', category: 'Leave' },
{ id: 'leave.edit', name: 'Edit Leave Requests', description: 'Modify existing leave requests', category: 'Leave' },
{ id: 'leave.delete', name: 'Delete Leave Requests', description: 'Remove leave requests', category: 'Leave' },
{ id: 'leave.approve', name: 'Approve Leave', description: 'Approve or reject leave requests', category: 'Leave' },

// Individual Profile 
{ id: 'profile.view', name: 'View Profile', description: 'View personal profile information', category: 'Profile' },
{ id: 'profile.edit', name: 'Edit Profile', description: 'Edit personal profile information', category: 'Profile' },

  // System Settings
  { id: 'system_settings', name: 'System Settings', description: 'Configure system settings', category: 'Settings' },
];
