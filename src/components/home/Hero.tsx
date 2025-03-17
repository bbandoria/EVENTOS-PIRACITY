import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchBar from '../ui/SearchBar';

interface HeroProps {
  className?: string;
  onSearch: (query: string) => void;
  onCategorySelect: (category: string) => void;
  selectedCategory: string | null;
}

const categories = [
  'Música ao Vivo',
  'Stand-up Comedy',
  'Happy Hour',
  'Eventos de Hoje'
];

const Hero = ({ className, onSearch, onCategorySelect, selectedCategory }: HeroProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
  };
  
  const handleFilter = () => {
    // In a real app, this would open filter modal
    console.log('Opening filters');
  };
  
  return (
    <div 
      className={cn(
        'relative w-full h-[75vh] min-h-[500px] max-h-[800px] overflow-hidden',
        className
      )}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2029&q=80" 
          alt="Bar atmosphere" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-6">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Descubra os melhores eventos em bares da cidade
          </h1>
          <p className="text-lg md:text-xl text-white/80">
            Shows, promoções, stand-up e muito mais. Tudo em um só lugar.
          </p>
          
          <div className="pt-4">
            <SearchBar 
              onSearch={handleSearch}
              onFilter={handleFilter}
              className="max-w-lg"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 pt-2">
            {categories.map(category => (
              <Button 
                key={category}
                size="sm"
                variant="secondary"
                onClick={() => onCategorySelect(category)}
                className={cn(
                  "rounded-full backdrop-blur-lg border-white/20",
                  selectedCategory === category
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-white/10 hover:bg-white/20 text-white"
                )}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </div>
  );
};

export default Hero;
