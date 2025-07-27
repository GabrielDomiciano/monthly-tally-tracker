export interface Conta {
  id: string;
  titulo: string;
  valor: number;
  data: string;
  categoria: string;
  status: 'pago' | 'pendente';
}

export interface ResumoMensal {
  total: number;
  pago: number;
  pendente: number;
  totalContas: number;
}

export const CATEGORIAS = [
  'Apartamento',
  'Energia',
  'Água',
  'Internet',
  'Telefone',
  'Alimentação',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Cartão de Crédito',
  'Igreja',
  'Outros'
] as const;

export type Categoria = typeof CATEGORIAS[number];