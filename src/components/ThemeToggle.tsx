"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-full hover:bg-slate-500/10 transition-colors text-slate-500 dark:text-slate-400 group relative overflow-hidden"
      aria-label="Cambiar tema"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      ) : (
        <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform" />
      )}
    </button>
  );
}
