import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'teacher' | 'parent' | 'student' | 'admin' | null;

export interface User {
  role: UserRole;
  name: string;
  email?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, userDetails?: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'futureminds_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading auth session:', e);
    }
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error saving auth session:', e);
    }
  }, [user]);

  const login = (role: UserRole, userDetails?: Partial<User>) => {
    let defaultName = 'User';
    if (role === 'teacher') defaultName = 'Anaya Sharma';
    if (role === 'parent') defaultName = 'Priya Sharma';
    if (role === 'student') defaultName = 'Ananya Patel';
    if (role === 'admin') defaultName = 'System Admin';

    setUser({
      role,
      name: userDetails?.name || defaultName,
      email: userDetails?.email || `${role}@futureminds.edu`,
      avatar: userDetails?.avatar,
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = 'http://localhost:5173/?view=role-select';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
