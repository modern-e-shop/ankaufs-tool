import { Search, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const [isDark, setIsDark] = useState(() => {
    return !document.documentElement.classList.contains("light");
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <header className="pt-8 pb-6 text-center relative">
      {/* Theme toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="theme-toggle absolute top-8 right-0"
        aria-label={isDark ? "Light Mode aktivieren" : "Dark Mode aktivieren"}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--text-heading)' }}>
        System Automation
      </h1>
      <p className="mt-2 text-lg text-indigo-400 font-medium tracking-wide">
        Ankaufs-Portal
      </p>
      <div className="mt-6 max-w-xl mx-auto relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Produkte suchen..."
          className="w-full pl-12 pr-4 py-3 rounded-xl backdrop-blur-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200"
          style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
          }}
        />
      </div>
    </header>
  );
}
