import React from 'react';
import { Button } from '@material-tailwind/react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../provider/DarkModeProvider';

const DarkModeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Button
      variant="text"
      onClick={toggleDarkMode}
      className={`
        p-2 rounded-full transition-all duration-300
        ${isDarkMode 
          ? 'bg-dark-neutral-200/10 text-dark-text-primary hover:bg-dark-neutral-200/20' 
          : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
        }
        ${className}
      `}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-yellow-400 animate-pulse" />
      ) : (
        <Moon className="h-5 w-5 text-primary-600 animate-infinite animate-pulse animate-ease-in-out" />
      )}
    </Button>
  );
};

export default DarkModeToggle;