import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Conta } from '@/types/conta';
import { formatCurrency, formatDate } from '@/lib/date-utils';
import { CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContaCardProps {
  conta: Conta;
  onEdit?: (conta: Conta) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

const ContaCard = ({ conta, onEdit, onDelete, onToggleStatus }: ContaCardProps) => {
  const isPago = conta.status === 'pago';

  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-elegant',
      isPago ? 'border-success/20 bg-success/5' : 'border-warning/20 bg-warning/5'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground">{conta.titulo}</h3>
              <Badge 
                variant={isPago ? 'default' : 'secondary'}
                className={cn(
                  'text-xs',
                  isPago 
                    ? 'bg-success text-success-foreground' 
                    : 'bg-warning text-warning-foreground'
                )}
              >
                {isPago ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                {conta.status}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(conta.valor)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(conta.data)} • {conta.categoria}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onToggleStatus && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleStatus(conta.id)}
                className="h-8 w-8 p-0"
              >
                <CheckCircle className={cn(
                  'h-4 w-4',
                  isPago ? 'text-success' : 'text-muted-foreground'
                )} />
              </Button>
            )}
            
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(conta)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(conta.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContaCard;