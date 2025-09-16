'use client';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Theme) || 'system';
    setThemeState(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const shouldDark = theme === 'dark' || (theme === 'system' && prefersDark);
    root.classList.toggle('dark', shouldDark);
    if (theme === 'system') localStorage.removeItem('theme');
    else localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme: (t: Theme) => setThemeState(t) };
}