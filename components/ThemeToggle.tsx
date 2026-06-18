'use client';

import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    console.log("Toggle clicked! Current theme:", theme);
    toggleTheme();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="p-2 rounded-md bg-secondary cursor-pointer text-foreground hover:opacity-80 transition-opacity"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
