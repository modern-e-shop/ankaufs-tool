import { Search } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="pt-8 pb-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
        System Automation
      </h1>
      <p className="mt-2 text-lg text-indigo-300 font-medium tracking-wide">
        Ankaufs-Portal
      </p>
      <div className="mt-6 max-w-xl mx-auto relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Produkte suchen..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[rgba(17,17,40,0.6)] backdrop-blur-sm border border-[rgba(99,102,241,0.2)] text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200"
        />
      </div>
    </header>
  );
}
