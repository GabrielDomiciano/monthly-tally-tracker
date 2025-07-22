export interface ContaFixa {
  id: string;
  titulo: string;
  categoria: string;
  valorPadrao: number;
  ativo: boolean;
  diaVencimento: number; // Dia do mês para vencimento
}

export interface GeracaoContasMensal {
  contaFixaId: string;
  valor: number;
  mes: string; // formato YYYY-MM
  jaGerada: boolean;
}