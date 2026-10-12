import { useApp } from '../../context/AppContext.jsx';

function resolveTheme(currentTheme) {
  if (currentTheme === 'dark' || currentTheme === 'light') return currentTheme;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function ThemeProvider({ children }) {
  return children;
}

export function useTheme() {
  const { currentTheme, toggleTheme, setTheme } = useApp();
  return {
    theme: resolveTheme(currentTheme),
    themeMode: currentTheme,
    setThemeMode: setTheme,
    toggleTheme,
  };
}
