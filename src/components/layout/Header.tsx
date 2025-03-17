import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Map, Heart, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const navLinks = [
    { name: 'Explorar', path: '/', icon: Search },
    { name: 'Mapa', path: '/map', icon: Map },
    { name: 'Favoritos', path: '/favorites', icon: Heart },
    { name: 'Hoje', path: '/today', icon: Calendar },
  ];
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4',
        isScrolled || isMobileMenuOpen
          ? 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="font-semibold text-xl tracking-tight text-primary transition-all duration-300"
        >
          <span className="flex items-center gap-1.5">
            Eventos<span className="font-light">Pira</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                location.pathname === link.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <span className="flex items-center gap-1.5">
                <link.icon size={16} />
                {link.name}
              </span>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex items-center gap-1.5"
            asChild
          >
            <Link to="/login">
              <User size={16} />
              <span>Entrar</span>
            </Link>
          </Button>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div 
        className={cn(
          'fixed inset-0 top-[72px] bg-white dark:bg-gray-900 md:hidden transition-all duration-300 ease-in-out z-40',
          isMobileMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        )}
      >
        <nav className="flex flex-col p-6 space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={cn(
                'px-4 py-3 rounded-md text-base font-medium transition-all duration-200 flex items-center gap-3',
                location.pathname === link.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <link.icon size={20} />
              {link.name}
            </Link>
          ))}
          <Link 
            to="/login"
            className="px-4 py-3 rounded-md text-base font-medium transition-all duration-200 flex items-center gap-3 mt-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <User size={20} />
            Entrar como Estabelecimento
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
