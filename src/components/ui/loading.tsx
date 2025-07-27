import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LoadingProps {
  isLoading: boolean;
  error?: string | null;
  retryCount?: number;
  onRetry?: () => void;
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loading = ({ 
  isLoading, 
  error, 
  retryCount = 0,
  onRetry, 
  children, 
  className,
  size = 'md',
  text = 'Carregando...'
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center p-4', className)}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
          <p className="text-sm text-muted-foreground">{text}</p>
          {retryCount > 0 && (
            <p className="text-xs text-muted-foreground">
              Tentativa {retryCount}...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex flex-col items-center justify-center p-4 gap-3', className)}>
        <AlertCircle className={cn('text-destructive', sizeClasses[size])} />
        <div className="text-center">
          <p className="text-sm font-medium text-destructive mb-2">
            Erro ao carregar dados
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            {error}
          </p>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-3 w-3" />
              Tentar Novamente
            </Button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={cn('animate-spin text-primary', sizeClasses[size], className)} />
  );
};

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export const LoadingSkeleton = ({ className, lines = 3 }: LoadingSkeletonProps) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-muted rounded w-full" />
        </div>
      ))}
    </div>
  );
}; 