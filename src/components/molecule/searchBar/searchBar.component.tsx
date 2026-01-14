import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Buscar..." 
}) => (
  <div className="relative max-w-md w-full">
    <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-slate-400" size={18} />
    <input
      type="text"
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm placeholder:text-slate-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
