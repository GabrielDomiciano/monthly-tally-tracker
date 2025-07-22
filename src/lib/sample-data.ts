import { Conta } from '@/types/conta';
import { storage } from './storage';

export const contasExemplo: Omit<Conta, 'id'>[] = [
  {
    titulo: 'Aluguel',
    valor: 1200.00,
    data: new Date().toISOString().split('T')[0],
    categoria: 'Aluguel',
    status: 'pago'
  },
  {
    titulo: 'Conta de Energia',
    valor: 180.50,
    data: new Date().toISOString().split('T')[0],
    categoria: 'Energia',
    status: 'pendente'
  },
  {
    titulo: 'Internet Fibra',
    valor: 89.90,
    data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    categoria: 'Internet',
    status: 'pago'
  },
  {
    titulo: 'Supermercado',
    valor: 320.75,
    data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    categoria: 'Alimentação',
    status: 'pago'
  },
  {
    titulo: 'Plano de Saúde',
    valor: 450.00,
    data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    categoria: 'Saúde',
    status: 'pendente'
  },
  // Mês anterior
  {
    titulo: 'Aluguel',
    valor: 1200.00,
    data: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    categoria: 'Aluguel',
    status: 'pago'
  },
  {
    titulo: 'Conta de Energia',
    valor: 165.30,
    data: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    categoria: 'Energia',
    status: 'pago'
  },
  {
    titulo: 'Internet Fibra',
    valor: 89.90,
    data: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    categoria: 'Internet',
    status: 'pago'
  }
];

export const adicionarContasExemplo = () => {
  const contasExistentes = storage.getContas();
  
  // Só adiciona se não há contas cadastradas
  if (contasExistentes.length === 0) {
    contasExemplo.forEach(conta => {
      storage.addConta(conta);
    });
    return true;
  }
  return false;
};