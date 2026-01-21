export const PERMS = {
  EMP_VIEW: "employees.view",
  EMP_CREATE: "employees.create",
  EMP_EDIT: "employees.edit",
  EMP_DELETE: "employees.delete",

  ANN_VIEW: "announcement.view",
  ANN_CREATE: "announcement.create",
  ANN_EDIT: "announcement.edit",
  ANN_DELETE: "announcement.delete",

  LEAVE_VIEW: "leave.view",
  LEAVE_APPROVE: "leave.approve",

  ATT_VIEW: "attendance.view",

  REPORT_VIEW: "reports.view",
  REPORT_EXPORT: "reports.export",

  LOG_VIEW: "logs.view",

  COMPANY_VIEW: "companies.view", // Add these
  COMPANY_CREATE: "companies.create", // Add these
  COMPANY_EDIT: "companies.edit", // Add these
  COMPANY_DELETE: "companies.delete",

  COMPANY_MANAGE: "companies.view", // Change from whatever it was
  ROLE_MANAGE: "roles.view", // Change from whatever it was

  // Add these

  ROLE_VIEW: "roles.view", // Add these
  ROLE_CREATE: "roles.create", // Add these
  ROLE_EDIT: "roles.edit", // Add these
  ROLE_DELETE: "roles.delete", // Add these

  DESIG_VIEW: "designations.view",
  DESIG_CREATE: "designations.create", // Add these
  DESIG_EDIT: "designations.edit", // Add these
  DESIG_DELETE: "designations.delete", // Add these

  SYS_SETTINGS: "system_settings",
} as const;
