import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getSettings, setSettings as saveSettings } from '../lib/storage';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (s: 'small' | 'medium' | 'large') => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light', toggleTheme: () => {}, fontSize: 'medium', setFontSize: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getSettings().theme);
  const [fontSize, setFS] = useState<'small' | 'medium' | 'large'>(() => getSettings().fontSize);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') { root.classList.add('dark'); } else { root.classList.remove('dark'); }
    const settings = getSettings();
    saveSettings({ ...settings, theme });
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    root.classList.add(fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base');
    const settings = getSettings();
    saveSettings({ ...settings, fontSize });
  }, [fontSize]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  const setFontSize = (s: 'small' | 'medium' | 'large') => setFS(s);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
