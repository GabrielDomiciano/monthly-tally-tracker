import { Conta } from '@/types/conta';
import { ContaFixa, GeracaoContasMensal } from '@/types/conta-fixa';

const STORAGE_KEY = 'contas-mensais';
const STORAGE_KEY_FIXAS = 'contas-fixas';
const STORAGE_KEY_GERACOES = 'geracoes-mensais';

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
      id: `conta-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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
  },

  // Funções para Contas Fixas
  getContasFixas: (): ContaFixa[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_FIXAS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setContasFixas: (contas: ContaFixa[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY_FIXAS, JSON.stringify(contas));
    } catch (error) {
      console.error('Erro ao salvar contas fixas:', error);
    }
  },

  addContaFixa: (conta: Omit<ContaFixa, 'id'>): ContaFixa => {
    const contasFixas = storage.getContasFixas();
    const novaContaFixa: ContaFixa = {
      ...conta,
      id: `fixa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    contasFixas.push(novaContaFixa);
    storage.setContasFixas(contasFixas);
    return novaContaFixa;
  },

  updateContaFixa: (id: string, updates: Partial<ContaFixa>): void => {
    const contasFixas = storage.getContasFixas();
    const index = contasFixas.findIndex(c => c.id === id);
    
    if (index !== -1) {
      contasFixas[index] = { ...contasFixas[index], ...updates };
      storage.setContasFixas(contasFixas);
    }
  },

  deleteContaFixa: (id: string): void => {
    const contasFixas = storage.getContasFixas();
    const filtered = contasFixas.filter(c => c.id !== id);
    storage.setContasFixas(filtered);
  },

  // Funções para Gerações Mensais
  getGeracoesMensais: (): GeracaoContasMensal[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_GERACOES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setGeracoesMensais: (geracoes: GeracaoContasMensal[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY_GERACOES, JSON.stringify(geracoes));
    } catch (error) {
      console.error('Erro ao salvar gerações mensais:', error);
    }
  },

  jaGeradoNoMes: (contaFixaId: string, mes: string): boolean => {
    const geracoes = storage.getGeracoesMensais();
    return geracoes.some(g => g.contaFixaId === contaFixaId && g.mes === mes && g.jaGerada);
  },

  marcarComoGerado: (contaFixaId: string, mes: string, valor: number): void => {
    const geracoes = storage.getGeracoesMensais();
    const existing = geracoes.find(g => g.contaFixaId === contaFixaId && g.mes === mes);
    
    if (existing) {
      existing.valor = valor;
      existing.jaGerada = true;
    } else {
      geracoes.push({
        contaFixaId,
        mes,
        valor,
        jaGerada: true
      });
    }
    
    storage.setGeracoesMensais(geracoes);
  }
};