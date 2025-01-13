// src/context/DarkModeContext.jsx
import React, { 
    createContext, 
    useState, 
    useContext, 
    useEffect 
  } from 'react';
  
  const DarkModeContext = createContext();
  
  export const DarkModeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
      // Check local storage or system preference
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        return JSON.parse(savedMode);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
  
    useEffect(() => {
      const root = window.document.documentElement;
      
      if (isDarkMode) {
        root.classList.add('dark');
        root.classList.remove('light');
        localStorage.setItem('darkMode', 'true');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        localStorage.setItem('darkMode', 'false');
      }
    }, [isDarkMode]);
  
    const toggleDarkMode = () => {
      setIsDarkMode(prev => !prev);
    };
  
    return (
      <DarkModeContext.Provider 
        value={{ 
          isDarkMode, 
          toggleDarkMode 
        }}
      >
        {children}
      </DarkModeContext.Provider>
    );
  };
  
  // Custom hook for easy access
  export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
      throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
  };