import { lazy, Suspense } from 'react';

export const PORTAL_PAGES = {
  'teacher-dashboard': lazy(() => import('./pages/TeacherDashboard.jsx').then(m => ({ default: m.TeacherDashboard }))),
  'teacher-assignments': lazy(() => import('./pages/TeacherAssignmentsPage.jsx').then(m => ({ default: m.TeacherAssignmentsPage }))),
  'teacher-announcements': lazy(() => import('./pages/TeacherAnnouncementsPage.jsx').then(m => ({ default: m.TeacherAnnouncementsPage }))),
  'teacher-progress': lazy(() => import('./pages/StudentProgressPage.jsx').then(m => ({ default: m.StudentProgressPage }))),
  'teacher-settings': lazy(() => import('./pages/TeacherSettingsPage.jsx').then(m => ({ default: m.TeacherSettingsPage }))),
  'teacher-lab-guide': lazy(() => import('./pages/TeacherLabGuidePage.jsx').then(m => ({ default: m.TeacherLabGuidePage }))),
  'parent-dashboard': lazy(() => import('./pages/parent/ParentDashboard.jsx').then(m => ({ default: m.ParentDashboard }))),
  'parent-progress': lazy(() => import('./pages/parent/ParentChildProgressPage.jsx').then(m => ({ default: m.ParentChildProgressPage }))),
  'parent-settings': lazy(() => import('./pages/parent/ParentSettingsPage.jsx').then(m => ({ default: m.ParentSettingsPage }))),
  'admin-dashboard': lazy(() => import('./pages/admin/AdminDashboard.jsx').then(m => ({ default: m.AdminDashboard }))),
  'admin-users': lazy(() => import('./pages/admin/AdminUserManagementPage.jsx').then(m => ({ default: m.AdminUserManagementPage }))),
  'admin-progress': lazy(() => import('./pages/admin/AdminPlatformProgressPage.jsx').then(m => ({ default: m.AdminPlatformProgressPage }))),
  'admin-settings': lazy(() => import('./pages/admin/AdminSettingsPage.jsx').then(m => ({ default: m.AdminSettingsPage }))),
};

export default function PortalApp({ view }) {
  const Page = PORTAL_PAGES[view];
  if (!Page) return null;
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F8F9FD] dark:bg-[#0F172A]"><div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div></div>}>
      <Page />
    </Suspense>
  );
}
