import { Conta } from '@/types/conta';

const STORAGE_KEY = 'contas-mensais';

export const storage = {
  getContas: (): Conta[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setContas: (contas: Conta[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contas));
    } catch (error) {
      console.error('Erro ao salvar contas:', error);
    }
  },

  addConta: (conta: Omit<Conta, 'id'>): Conta => {
    const contas = storage.getContas();
    const novaConta: Conta = {
      ...conta,
      id: Date.now().toString()
    };
    
    contas.push(novaConta);
    storage.setContas(contas);
    return novaConta;
  },

  updateConta: (id: string, updates: Partial<Conta>): void => {
    const contas = storage.getContas();
    const index = contas.findIndex(c => c.id === id);
    
    if (index !== -1) {
      contas[index] = { ...contas[index], ...updates };
      storage.setContas(contas);
    }
  },

  deleteConta: (id: string): void => {
    const contas = storage.getContas();
    const filtered = contas.filter(c => c.id !== id);
    storage.setContas(filtered);
  }
};