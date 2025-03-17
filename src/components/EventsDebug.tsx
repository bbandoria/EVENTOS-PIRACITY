import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Bug, Calendar, Info, AlertCircle } from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Event {
  id?: string;
  title: string;
  date: string;
  [key: string]: any;
}

interface EventsDebugProps {
  events: Event[];
  selectedDate: Date | null;
}

export function EventsDebug({ events, selectedDate }: EventsDebugProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showRawData, setShowRawData] = useState(false);

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  // Função para verificar se duas datas são iguais (mesmo dia)
  const areDatesEqual = (dateStr: string, compareDate: Date | null) => {
    if (!compareDate) return false;
    
    try {
      const date1 = parseISO(dateStr);
      return isSameDay(date1, compareDate);
    } catch (e) {
      return false;
    }
  };

  // Função para obter detalhes da comparação de datas
  const getDateComparisonDetails = (dateStr: string, compareDate: Date | null) => {
    if (!compareDate) return { matches: false, details: 'Nenhuma data selecionada' };
    
    try {
      const eventDate = parseISO(dateStr);
      
      // Formato ISO para comparação
      const eventDateISO = eventDate.toISOString().split('T')[0];
      const compareDateISO = compareDate.toISOString().split('T')[0];
      
      // Verificar se são o mesmo dia
      const matches = isSameDay(eventDate, compareDate);
      
      // Detalhes para depuração
      return {
        matches,
        details: `
          Evento: ${eventDateISO} (${eventDate.getTime()})
          Selecionada: ${compareDateISO} (${compareDate.getTime()})
          Mesmo dia: ${matches ? 'Sim' : 'Não'}
        `
      };
    } catch (e) {
      return { matches: false, details: `Erro: ${e}` };
    }
  };

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="w-full flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          <Bug className="h-4 w-4" />
          Depuração de Eventos
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <Card className="mt-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Depuração de Eventos</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowRawData(!showRawData)}
                >
                  {showRawData ? 'Ocultar dados brutos' : 'Mostrar dados brutos'}
                </Button>
                <Badge variant="outline">
                  {events.length} eventos
                </Badge>
              </div>
            </div>
            <CardDescription>
              Informações detalhadas sobre os eventos e datas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Data Selecionada</h3>
                {selectedDate ? (
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {format(selectedDate, 'dd/MM/yyyy (EEEE)', { locale: ptBR })}
                    </Badge>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div><strong>ISO:</strong> {selectedDate.toISOString()}</div>
                      <div><strong>ISO (data):</strong> {selectedDate.toISOString().split('T')[0]}</div>
                      <div><strong>Timestamp:</strong> {selectedDate.getTime()}</div>
                      <div><strong>Horas/Min/Seg:</strong> {selectedDate.getHours()}:{selectedDate.getMinutes()}:{selectedDate.getSeconds()}</div>
                    </div>
                  </div>
                ) : (
                  <Badge variant="outline" className="bg-gray-100">Nenhuma data selecionada</Badge>
                )}
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Eventos por Data</h3>
                {events.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum evento encontrado</p>
                ) : (
                  <div className="space-y-2">
                    {events.map(event => {
                      const dateComparison = getDateComparisonDetails(event.date, selectedDate);
                      
                      return (
                        <div key={event.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{event.title}</span>
                            <Badge 
                              variant="outline" 
                              className={`flex items-center gap-1 ${
                                dateComparison.matches 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              <Calendar className="h-3 w-3" />
                              {formatDate(event.date)}
                              {dateComparison.matches && <Info className="h-3 w-3 ml-1" />}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            <span>ID: {event.id}</span>
                            <span className="mx-2">•</span>
                            <span>Data ISO: {event.date}</span>
                          </div>
                          
                          {showRawData && (
                            <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                              <pre className="whitespace-pre-wrap">{JSON.stringify(event, null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Comparação de Datas</h3>
                {selectedDate && events.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <p className="text-xs text-amber-700">
                        Para que um evento seja exibido, sua data deve corresponder exatamente à data selecionada (mesmo dia).
                      </p>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Data selecionada (ISO): {selectedDate.toISOString().split('T')[0]}
                    </p>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-1">Evento</th>
                          <th className="text-left py-1">Data</th>
                          <th className="text-left py-1">Corresponde?</th>
                          <th className="text-left py-1">Detalhes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map(event => {
                          try {
                            const eventDate = parseISO(event.date);
                            const normalizedEventDate = new Date(eventDate);
                            normalizedEventDate.setHours(0, 0, 0, 0);
                            
                            const normalizedSelectedDate = new Date(selectedDate);
                            normalizedSelectedDate.setHours(0, 0, 0, 0);
                            
                            const matches = normalizedEventDate.getTime() === normalizedSelectedDate.getTime();
                            const isSameDayResult = isSameDay(eventDate, selectedDate);
                            
                            return (
                              <tr key={event.id} className="border-b last:border-b-0">
                                <td className="py-1">{event.title}</td>
                                <td className="py-1">{event.date}</td>
                                <td className="py-1">
                                  {matches ? (
                                    <Badge variant="outline" className="bg-green-100 text-green-800">Sim</Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-red-100 text-red-800">Não</Badge>
                                  )}
                                </td>
                                <td className="py-1 text-xs">
                                  <div>Normalizado: {matches ? 'Sim' : 'Não'}</div>
                                  <div>isSameDay: {isSameDayResult ? 'Sim' : 'Não'}</div>
                                  <div>Evento: {normalizedEventDate.toISOString()}</div>
                                  <div>Selecionada: {normalizedSelectedDate.toISOString()}</div>
                                </td>
                              </tr>
                            );
                          } catch (e) {
                            return (
                              <tr key={event.id} className="border-b last:border-b-0">
                                <td className="py-1">{event.title}</td>
                                <td className="py-1">{event.date}</td>
                                <td className="py-1">
                                  <Badge variant="outline" className="bg-red-100 text-red-800">Erro</Badge>
                                </td>
                                <td className="py-1 text-xs text-red-500">
                                  Erro ao processar data: {String(e)}
                                </td>
                              </tr>
                            );
                          }
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Selecione uma data e carregue eventos para ver a comparação
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 