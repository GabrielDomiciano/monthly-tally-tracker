import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: string): string => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
};

export const getCurrentMonth = (): { start: Date; end: Date } => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now)
  };
};

export const getPreviousMonth = (): { start: Date; end: Date } => {
  const now = new Date();
  const previousMonth = subMonths(now, 1);
  return {
    start: startOfMonth(previousMonth),
    end: endOfMonth(previousMonth)
  };
};

export const isDateInMonth = (date: string, monthStart: Date, monthEnd: Date): boolean => {
  const targetDate = new Date(date);
  return isWithinInterval(targetDate, { start: monthStart, end: monthEnd });
};

export const getMonthName = (date: Date): string => {
  return format(date, 'MMMM yyyy', { locale: ptBR });
};