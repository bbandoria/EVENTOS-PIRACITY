
import { cn } from '@/lib/utils';

interface CategoryPillProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const CategoryPill = ({ 
  label, 
  icon, 
  active = false, 
  onClick, 
  className 
}: CategoryPillProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300',
        'hover:scale-[1.03] active:scale-[0.97]',
        active 
          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10' 
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default CategoryPill;
