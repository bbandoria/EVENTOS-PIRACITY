import { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: () => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ 
  onSearch, 
  onFilter, 
  placeholder = "Buscar eventos, bares...", 
  className 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Chamar onSearch quando o query mudar (com debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300); // 300ms de debounce

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleSearch = () => {
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div 
      className={cn(
        'relative flex items-center w-full transition-all duration-200 ease-out',
        isFocused ? 'scale-[1.02]' : 'scale-100',
        className
      )}
    >
      <div 
        className={cn(
          'flex items-center w-full bg-muted rounded-full overflow-hidden transition-all duration-300 px-4',
          isFocused 
            ? 'border-2 border-primary/20 shadow-lg shadow-primary/5' 
            : 'border border-border'
        )}
      >
        <Search 
          size={18} 
          className={cn(
            'text-muted-foreground transition-colors duration-200 ease-in-out',
            isFocused && 'text-foreground'
          )} 
        />
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none p-3 text-sm placeholder:text-muted-foreground/70"
        />
        {query && (
          <button 
            onClick={clearSearch}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <button
        onClick={onFilter}
        className={cn(
          'ml-2 p-3 rounded-full bg-primary/5 border border-border hover:bg-primary/10 transition-all duration-200',
          'flex items-center justify-center'
        )}
        aria-label="Filter"
      >
        <SlidersHorizontal size={18} className="text-foreground" />
      </button>
    </div>
  );
};

export default SearchBar;
