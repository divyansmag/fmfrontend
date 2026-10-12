import { TeacherDashboard } from './pages/TeacherDashboard.jsx';
import { StudentProgressPage } from './pages/StudentProgressPage.jsx';
import { TeacherSettingsPage } from './pages/TeacherSettingsPage.jsx';
import { ParentDashboard } from './pages/parent/ParentDashboard.jsx';
import { ParentChildProgressPage } from './pages/parent/ParentChildProgressPage.jsx';
import { ParentSettingsPage } from './pages/parent/ParentSettingsPage.jsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { AdminPlatformProgressPage } from './pages/admin/AdminPlatformProgressPage.jsx';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.jsx';

export const PORTAL_PAGES = {
  'teacher-dashboard': TeacherDashboard,
  'teacher-progress': StudentProgressPage,
  'teacher-settings': TeacherSettingsPage,
  'parent-dashboard': ParentDashboard,
  'parent-progress': ParentChildProgressPage,
  'parent-settings': ParentSettingsPage,
  'admin-dashboard': AdminDashboard,
  'admin-progress': AdminPlatformProgressPage,
  'admin-settings': AdminSettingsPage,
};

export default function PortalApp({ view }) {
  const Page = PORTAL_PAGES[view];
  if (!Page) return null;
  return <Page />;
}
