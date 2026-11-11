import { useApp } from '../../context/AppContext.jsx';

export function AuthProvider({ children }) {
  return children;
}

export function useAuth() {
  const { user, loginAsRole, handleLogout } = useApp();
  return {
    user: {
      role: String(user.role || 'student').toLowerCase(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    login: loginAsRole,
    logout: handleLogout,
  };
}
