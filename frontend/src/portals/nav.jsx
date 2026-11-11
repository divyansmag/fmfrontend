import { useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';

export const PATH_TO_VIEW = {
  '/': 'role-select',
  '/login/teacher': 'teacher-login',
  '/login/parent': 'parent-login',
  '/login/admin': 'admin-login',
  '/login/student': 'student-login',
  '/teacher/dashboard': 'teacher-dashboard',
  '/teacher/assignments': 'teacher-assignments',
  '/teacher/announcements': 'teacher-announcements',
  '/teacher/student-progress': 'teacher-progress',
  '/teacher/settings': 'teacher-settings',
  '/teacher/lab-guide': 'teacher-lab-guide',
  '/parent/dashboard': 'parent-dashboard',
  '/parent/child-progress': 'parent-progress',
  '/parent/settings': 'parent-settings',
  '/admin/dashboard': 'admin-dashboard',
  '/admin/users': 'admin-users',
  '/admin/platform-progress': 'admin-progress',
  '/admin/settings': 'admin-settings',
  '/admin/cms': 'cms',
};

const VIEW_TO_PATH = Object.fromEntries(
  Object.entries(PATH_TO_VIEW).map(([path, view]) => [view, path])
);

export function useNavigate() {
  const { navigateTo } = useApp();
  return (to) => {
    if (!to || to === '#') return;
    navigateTo(PATH_TO_VIEW[to] || to);
  };
}

export function useLocation() {
  const { currentView } = useApp();
  return { pathname: VIEW_TO_PATH[currentView] || '/' };
}

export function Link({ to, children, className, onClick, ...rest }) {
  const navigate = useNavigate();
  return (
    <a
      href={to || '#'}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
        if (to && to !== '#') {
          navigate(to);
        }
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function Navigate({ to }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  return null;
}

export function BrowserRouter({ children }) {
  return children;
}

export function Routes({ children }) {
  return children;
}

export function Route() {
  return null;
}
