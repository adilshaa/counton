import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const THEME_STORAGE_KEY = 'timerAppTheme';
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) {
      return storedTheme;
    }
    // Default to dark theme if no preference or stored theme
    // return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return 'dark'; // Defaulting to dark as per original app design
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      // For main app background, if it's controlled by a specific element and not just html/body
      // document.body.style.backgroundColor = '#1a202c'; // Example dark mode color
    } else {
      root.classList.remove('dark');
      // document.body.style.backgroundColor = '#f7fafc'; // Example light mode color
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined || context === null) { // Added null check
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
