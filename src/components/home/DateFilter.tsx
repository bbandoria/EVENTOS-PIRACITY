import { format, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DateFilterProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
}

export default function DateFilter({ selectedDate, onDateSelect }: DateFilterProps) {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Eventos por Data</h2>
        <p className="text-muted-foreground">Selecione uma data para ver os eventos</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
        {dates.map((date) => {
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
          const isToday = isSameDay(date, today);
          
          return (
            <Button
              key={date.toISOString()}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "min-w-[120px] flex-shrink-0",
                isSelected && "bg-primary text-primary-foreground",
                !isSelected && isToday && "border-primary"
              )}
              onClick={() => onDateSelect(date)}
            >
              <div className="text-center">
                <div className="text-sm font-medium">
                  {format(date, "EEEE", { locale: ptBR })}
                </div>
                <div className="text-xs opacity-80">
                  {format(date, "d 'de' MMMM", { locale: ptBR })}
                </div>
              </div>
            </Button>
          );
        })}
        
        {selectedDate && (
          <Button
            variant="ghost"
            className="min-w-[120px] flex-shrink-0"
            onClick={() => onDateSelect(null)}
          >
            <div className="text-center">
              <div className="text-sm font-medium">
                Limpar
              </div>
              <div className="text-xs opacity-80">
                Ver todos
              </div>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
} 