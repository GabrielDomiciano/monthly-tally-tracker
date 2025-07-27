import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumoCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

const ResumoCard = ({ title, value, icon: Icon, change, variant = 'default' }: ResumoCardProps) => {
  const variantStyles = {
    default: 'border-border',
    success: 'border-success/20 bg-success/5',
    warning: 'border-warning/20 bg-warning/5',
    destructive: 'border-destructive/20 bg-destructive/5'
  };

  const iconStyles = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive'
  };

  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-elegant hover:scale-105',
      variantStyles[variant]
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', iconStyles[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-lg sm:text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={cn(
            'text-xs mt-1',
            change.type === 'increase' && 'text-success',
            change.type === 'decrease' && 'text-destructive',
            change.type === 'neutral' && 'text-muted-foreground'
          )}>
            {change.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumoCard;