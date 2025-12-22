import { type Role, type Permission } from '@/src/app/types/types';

export const availablePermissions: Permission[] = [
  { id: 'view_employees', name: 'View Employees', description: 'View employee information', category: 'Users' },
  { id: 'create_employees', name: 'Create Employees', description: 'Add new employees', category: 'Users' },
  { id: 'edit_employees', name: 'Edit Employees', description: 'Modify employee details', category: 'Users' },
  { id: 'delete_employees', name: 'Delete Employees', description: 'Remove employees', category: 'Users' },

  { id: 'view_announcements', name: 'View Announcements', description: 'View company announcements', category: 'Content' },
  { id: 'create_announcements', name: 'Create Announcements', description: 'Post new announcements', category: 'Content' },
  { id: 'edit_announcements', name: 'Edit Announcements', description: 'Modify announcements', category: 'Content' },
  { id: 'delete_announcements', name: 'Delete Announcements', description: 'Remove announcements', category: 'Content' },

  { id: 'view_leave', name: 'View Leave Requests', description: 'View leave applications', category: 'Content' },
  { id: 'approve_leave', name: 'Approve Leave', description: 'Approve/reject leave requests', category: 'Content' },
  { id: 'view_attendance', name: 'View Attendance', description: 'View attendance records', category: 'Content' },

  { id: 'view_reports', name: 'View Reports', description: 'Access system reports', category: 'Reports' },
  { id: 'export_reports', name: 'Export Reports', description: 'Download report data', category: 'Reports' },
  { id: 'view_logs', name: 'View System Logs', description: 'Access activity logs', category: 'Reports' },

  { id: 'manage_roles', name: 'Manage Roles', description: 'Create and edit roles', category: 'Settings' },
  { id: 'manage_companies', name: 'Manage Companies', description: 'Add/edit companies', category: 'Settings' },
  { id: 'manage_designations', name: 'Manage Designations', description: 'Add/edit designations', category: 'Settings' },
  { id: 'system_settings', name: 'System Settings', description: 'Configure system settings', category: 'Settings' },
];

export const initialRoles: Role[] = [
  {
    role_id: 'ROL-001',
    roleName: 'Administrator',
    description: 'Full system access with all permissions.',
    status: 'Active',
    userCount: 3,
    permissions: availablePermissions.map(p => p.id),
    color: 'red',
    createdAt: '2024-01-01T09:00:00',
    updatedAt: '2024-01-01T09:00:00',
  },
  {
    role_id: 'ROL-002',
    roleName: 'Manager',
    description: 'Manage team members and view reports.',
    status: 'Active',
    userCount: 8,
    permissions: ['view_employees', 'edit_employees', 'view_reports'],
    color: 'blue',
    createdAt: '2024-01-05T09:00:00',
    updatedAt: '2024-01-05T09:00:00',
  },
   {
    role_id: 'ROL-003',
    roleName: 'Manager',
    description: 'Manage team members and view reports.',
    status: 'Active',
    userCount: 8,
    permissions: ['view_employees', 'edit_employees', 'view_reports'],
    color: 'blue',
    createdAt: '2024-01-05T09:00:00',
    updatedAt: '2024-01-05T09:00:00',
  }, {
    role_id: 'ROL-004',
    roleName: 'Manager',
    description: 'Manage team members and view reports.',
    status: 'Active',
    userCount: 8,
    permissions: ['view_employees', 'edit_employees', 'view_reports'],
    color: 'blue',
    createdAt: '2024-01-05T09:00:00',
    updatedAt: '2024-01-05T09:00:00',
  }, {
    role_id: 'ROL-005',
    roleName: 'Manager',
    description: 'Manage team members and view reports.',
    status: 'Inactive',
    userCount: 8,
    permissions: ['view_employees', 'edit_employees', 'view_reports'],
    color: 'blue',
    createdAt: '2024-01-05T09:00:00',
    updatedAt: '2024-01-05T09:00:00',
  },
  // Add the rest...
];
