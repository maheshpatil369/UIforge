// components/ThemeToggle.tsx
"use client"
import { THEMES, applyTheme } from "@/data/Themes";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    if (isDark) {
      applyTheme(THEMES.GOOGLE); // Light Mode
    } else {
      applyTheme(THEMES.GITHUB); // Dark Mode
    }
    setIsDark(!isDark);
  };

  return (
    <button onClick={toggleTheme} className="p-2 rounded-md border">
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};