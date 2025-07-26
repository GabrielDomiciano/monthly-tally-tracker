import { Conta } from '@/types/conta';
import { ContaFixa, GeracaoContasMensal } from '@/types/conta-fixa';
import { supabase } from '@/integrations/supabase/client';

export const storage = {
  // CRUD operations for Conta
  getContas: async (): Promise<Conta[]> => {
    try {
      const { data, error } = await supabase
        .from('contas')
        .select('*')
        .order('data', { ascending: false });
      
      if (error) {
        console.error('Erro ao carregar contas:', error);
        return [];
      }
      
      return data?.map(conta => ({
        id: conta.id,
        titulo: conta.titulo,
        valor: Number(conta.valor),
        data: conta.data,
        categoria: conta.categoria,
        status: conta.status as 'pago' | 'pendente'
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      return [];
    }
  },

  setContas: async (contas: Conta[]): Promise<void> => {
    // This method is kept for compatibility but not used with Supabase
    console.warn('setContas is deprecated when using Supabase');
  },

  addConta: async (conta: Omit<Conta, 'id'>): Promise<Conta> => {
    try {
      const { data, error } = await supabase
        .from('contas')
        .insert({
          titulo: conta.titulo,
          valor: conta.valor,
          data: conta.data,
          categoria: conta.categoria,
          status: conta.status
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao adicionar conta:', error);
        throw error;
      }
      
      return {
        id: data.id,
        titulo: data.titulo,
        valor: Number(data.valor),
        data: data.data,
        categoria: data.categoria,
        status: data.status as 'pago' | 'pendente'
      };
    } catch (error) {
      console.error('Erro ao adicionar conta:', error);
      throw error;
    }
  },

  updateConta: async (id: string, updates: Partial<Conta>): Promise<void> => {
    try {
      const updateData: any = {};
      if (updates.titulo !== undefined) updateData.titulo = updates.titulo;
      if (updates.valor !== undefined) updateData.valor = updates.valor;
      if (updates.data !== undefined) updateData.data = updates.data;
      if (updates.categoria !== undefined) updateData.categoria = updates.categoria;
      if (updates.status !== undefined) updateData.status = updates.status;

      const { error } = await supabase
        .from('contas')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao atualizar conta:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      throw error;
    }
  },

  deleteConta: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('contas')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar conta:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      throw error;
    }
  },

  // CRUD operations for ContaFixa
  getContasFixas: async (): Promise<ContaFixa[]> => {
    try {
      const { data, error } = await supabase
        .from('contas_fixas')
        .select('*')
        .order('titulo', { ascending: true });
      
      if (error) {
        console.error('Erro ao carregar contas fixas:', error);
        return [];
      }
      
      return data?.map(conta => ({
        id: conta.id,
        titulo: conta.titulo,
        categoria: conta.categoria,
        valorPadrao: Number(conta.valor_padrao),
        ativo: conta.ativo,
        diaVencimento: conta.dia_vencimento
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar contas fixas:', error);
      return [];
    }
  },

  setContasFixas: async (contas: ContaFixa[]): Promise<void> => {
    // This method is kept for compatibility but not used with Supabase
    console.warn('setContasFixas is deprecated when using Supabase');
  },

  addContaFixa: async (conta: Omit<ContaFixa, 'id'>): Promise<ContaFixa> => {
    try {
      const { data, error } = await supabase
        .from('contas_fixas')
        .insert({
          titulo: conta.titulo,
          categoria: conta.categoria,
          valor_padrao: conta.valorPadrao,
          ativo: conta.ativo,
          dia_vencimento: conta.diaVencimento
        })
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao adicionar conta fixa:', error);
        throw error;
      }
      
      return {
        id: data.id,
        titulo: data.titulo,
        categoria: data.categoria,
        valorPadrao: Number(data.valor_padrao),
        ativo: data.ativo,
        diaVencimento: data.dia_vencimento
      };
    } catch (error) {
      console.error('Erro ao adicionar conta fixa:', error);
      throw error;
    }
  },

  updateContaFixa: async (id: string, updates: Partial<ContaFixa>): Promise<void> => {
    try {
      const updateData: any = {};
      if (updates.titulo !== undefined) updateData.titulo = updates.titulo;
      if (updates.categoria !== undefined) updateData.categoria = updates.categoria;
      if (updates.valorPadrao !== undefined) updateData.valor_padrao = updates.valorPadrao;
      if (updates.ativo !== undefined) updateData.ativo = updates.ativo;
      if (updates.diaVencimento !== undefined) updateData.dia_vencimento = updates.diaVencimento;

      const { error } = await supabase
        .from('contas_fixas')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao atualizar conta fixa:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar conta fixa:', error);
      throw error;
    }
  },

  deleteContaFixa: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('contas_fixas')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar conta fixa:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao deletar conta fixa:', error);
      throw error;
    }
  },

  // CRUD operations for GeracaoContasMensal
  getGeracoesMensais: async (): Promise<GeracaoContasMensal[]> => {
    try {
      const { data, error } = await supabase
        .from('geracoes_mensais')
        .select('*')
        .order('mes', { ascending: false });
      
      if (error) {
        console.error('Erro ao carregar gerações mensais:', error);
        return [];
      }
      
      return data?.map(geracao => ({
        contaFixaId: geracao.conta_fixa_id,
        valor: Number(geracao.valor),
        mes: geracao.mes,
        jaGerada: geracao.ja_gerada
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar gerações mensais:', error);
      return [];
    }
  },

  setGeracoesMensais: async (geracoes: GeracaoContasMensal[]): Promise<void> => {
    // This method is kept for compatibility but not used with Supabase
    console.warn('setGeracoesMensais is deprecated when using Supabase');
  },

  jaGeradoNoMes: async (contaFixaId: string, mes: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('geracoes_mensais')
        .select('ja_gerada')
        .eq('conta_fixa_id', contaFixaId)
        .eq('mes', mes)
        .eq('ja_gerada', true)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erro ao verificar geração:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Erro ao verificar geração:', error);
      return false;
    }
  },

  marcarComoGerado: async (contaFixaId: string, mes: string, valor: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('geracoes_mensais')
        .upsert({
          conta_fixa_id: contaFixaId,
          mes: mes,
          valor: valor,
          ja_gerada: true
        }, {
          onConflict: 'conta_fixa_id,mes'
        });
      
      if (error) {
        console.error('Erro ao marcar como gerado:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao marcar como gerado:', error);
      throw error;
    }
  }
};