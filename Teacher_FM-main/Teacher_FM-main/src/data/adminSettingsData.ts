export interface AdminSettingsInfo {
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  department: string;
  employeeId: string;
  accessLevel: string;
  manageAccessFor: string;
  portalRole: string;
  status: string;
  organizationTitle: string;
}

export interface AdminCommunicationPref {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export const adminSettingsData: AdminSettingsInfo = {
  name: 'Admin',
  email: 'admin@futureminds.ai',
  phone: '+91 98765 43210',
  organization: 'FutureMinds AI Labs',
  role: 'System Administrator',
  department: 'Administration',
  employeeId: 'FM-A001',
  accessLevel: 'Full Access',
  manageAccessFor: 'All modules and platform features',
  portalRole: 'Administrator',
  status: 'Active',
  organizationTitle: 'System Administrator • FutureMinds AI Labs',
};

export const defaultAdminCommunicationPrefs: AdminCommunicationPref[] = [
  {
    id: 'platform_updates',
    title: 'Platform Updates',
    description: 'Important announcements and updates',
    enabled: true,
  },
  {
    id: 'system_alerts',
    title: 'System Alerts',
    description: 'Critical alerts and system notifications',
    enabled: true,
  },
];
