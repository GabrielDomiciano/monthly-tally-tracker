import { Conta } from '@/types/conta';
import { ContaFixa, GeracaoContasMensal } from '@/types/conta-fixa';
import { supabase } from '@/integrations/supabase/client';

export const storage = {
  // CRUD operations for Conta
  getContas: async (signal?: AbortSignal): Promise<Conta[]> => {
    try {
      // Verificar se a operação foi cancelada
      if (signal?.aborted) {
        throw new Error('Operação cancelada');
      }

      const { data, error } = await supabase
        .from('contas')
        .select('*')
        .order('data', { ascending: false });
      
      if (error) {
        console.error('Erro ao carregar contas:', error);
        throw new Error(`Erro ao carregar contas: ${error.message}`);
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
      throw error;
    }
  },

  setContas: async (contas: Conta[]): Promise<void> => {
    // This method is kept for compatibility but not used with Supabase
    console.warn('setContas is deprecated when using Supabase');
  },

  addConta: async (conta: Omit<Conta, 'id'>, signal?: AbortSignal): Promise<Conta> => {
    try {
      if (signal?.aborted) {
        throw new Error('Operação cancelada');
      }

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
        throw new Error(`Erro ao adicionar conta: ${error.message}`);
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

  updateConta: async (id: string, updates: Partial<Conta>, signal?: AbortSignal): Promise<void> => {
    try {
      if (signal?.aborted) {
        throw new Error('Operação cancelada');
      }

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
        throw new Error(`Erro ao atualizar conta: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      throw error;
    }
  },

  deleteConta: async (id: string, signal?: AbortSignal): Promise<void> => {
    try {
      if (signal?.aborted) {
        throw new Error('Operação cancelada');
      }

      const { error } = await supabase
        .from('contas')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar conta:', error);
        throw new Error(`Erro ao deletar conta: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      throw error;
    }
  },

  // CRUD operations for ContaFixa
  getContasFixas: async (signal?: AbortSignal): Promise<ContaFixa[]> => {
    try {
      if (signal?.aborted) {
        throw new Error('Operação cancelada');
      }

      const { data, error } = await supabase
        .from('contas_fixas')
        .select('*')
        .order('titulo', { ascending: true });
      
      if (error) {
        console.error('Erro ao carregar contas fixas:', error);
        throw new Error(`Erro ao carregar contas fixas: ${error.message}`);
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
      throw error;
    }
  },

  setContasFixas: async (contas: ContaFixa[]): Promise<void> => {
    // This method is kept for compatibility but not used with Supabase
    console.warn('setContasFixas is deprecated when using Supabase');
  },

  addContaFixa: async (conta: Omit<ContaFixa, 'id'>, signal?: AbortSignal): Promise<ContaFixa> => {
    try {
      if (signal?.aborted) {
        throw new Error('Operação cancelada');
      }

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
        throw new Error(`Erro ao adicionar conta fixa: ${error.message}`);
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

  updateContaFixa: async (id: string, updates: Partial<ContaFixa>, signal?: AbortSignal): Promise<void> => {
    try {
      if (signal?.aborted) {
        throw new Error('Operação cancelada');
      }

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
        throw new Error(`Erro ao atualizar conta fixa: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar conta fixa:', error);
      throw error;
    }
  },

  deleteContaFixa: async (id: string, signal?: AbortSignal): Promise<void> => {
    try {
      if (signal?.aborted) {
        throw new Error('Operação cancelada');
      }

      const { error } = await supabase
        .from('contas_fixas')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar conta fixa:', error);
        throw new Error(`Erro ao deletar conta fixa: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao deletar conta fixa:', error);
      throw error;
    }
  },

  // CRUD operations for GeracaoContasMensal
  getGeracoesMensais: async (signal?: AbortSignal): Promise<GeracaoContasMensal[]> => {
    try {
      if (signal?.aborted) {
        throw new Error('Operação cancelada');
      }

      const { data, error } = await supabase
        .from('geracoes_mensais')
        .select('*')
        .order('mes', { ascending: false });
      
      if (error) {
        console.error('Erro ao carregar gerações mensais:', error);
        throw new Error(`Erro ao carregar gerações mensais: ${error.message}`);
      }
      
      return data?.map(geracao => ({
        contaFixaId: geracao.conta_fixa_id,
        valor: Number(geracao.valor),
        mes: geracao.mes,
        jaGerada: geracao.ja_gerada
      })) || [];
    } catch (error) {
      console.error('Erro ao carregar gerações mensais:', error);
      throw error;
    }
  },

  setGeracoesMensais: async (geracoes: GeracaoContasMensal[]): Promise<void> => {
    // This method is kept for compatibility but not used with Supabase
    console.warn('setGeracoesMensais is deprecated when using Supabase');
  },

  jaGeradoNoMes: async (contaFixaId: string, mes: string, signal?: AbortSignal): Promise<boolean> => {
    try {
      if (signal?.aborted) {
        throw new Error('Operação cancelada');
      }

      const { data, error } = await supabase
        .from('geracoes_mensais')
        .select('ja_gerada')
        .eq('conta_fixa_id', contaFixaId)
        .eq('mes', mes)
        .eq('ja_gerada', true)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erro ao verificar geração:', error);
        throw new Error(`Erro ao verificar geração: ${error.message}`);
      }
      
      return !!data;
    } catch (error) {
      console.error('Erro ao verificar geração:', error);
      throw error;
    }
  },

  marcarComoGerado: async (contaFixaId: string, mes: string, valor: number, signal?: AbortSignal): Promise<void> => {
    try {
      if (signal?.aborted) {
        throw new Error('Operação cancelada');
      }

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
        throw new Error(`Erro ao marcar como gerado: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao marcar como gerado:', error);
      throw error;
    }
  },

  atualizarValorGeracao: async (contaFixaId: string, mes: string, novoValor: number, signal?: AbortSignal): Promise<void> => {
    try {
      if (signal?.aborted) {
        throw new Error('Operação cancelada');
      }

      // Atualizar o valor na tabela geracoes_mensais
      const { error: geracaoError } = await supabase
        .from('geracoes_mensais')
        .update({ valor: novoValor })
        .eq('conta_fixa_id', contaFixaId)
        .eq('mes', mes);
      
      if (geracaoError) {
        console.error('Erro ao atualizar valor da geração:', geracaoError);
        throw new Error(`Erro ao atualizar valor da geração: ${geracaoError.message}`);
      }

      // Buscar os dados da conta fixa para encontrar a conta correspondente
      const { data: contaFixa, error: contaFixaError } = await supabase
        .from('contas_fixas')
        .select('titulo, categoria, dia_vencimento')
        .eq('id', contaFixaId)
        .single();

      if (contaFixaError) {
        console.error('Erro ao buscar conta fixa:', contaFixaError);
        throw new Error(`Erro ao buscar conta fixa: ${contaFixaError.message}`);
      }

      // Calcular a data de vencimento para encontrar a conta correspondente
      const [ano, mesNum] = mes.split('-');
      const diaVencimento = Math.min(contaFixa.dia_vencimento, new Date(parseInt(ano), parseInt(mesNum), 0).getDate());
      const dataVencimento = `${ano}-${mesNum}-${diaVencimento.toString().padStart(2, '0')}`;

      // Atualizar a conta correspondente na tabela contas
      const { error: contaError } = await supabase
        .from('contas')
        .update({ valor: novoValor })
        .eq('titulo', contaFixa.titulo)
        .eq('categoria', contaFixa.categoria)
        .eq('data', dataVencimento);

      if (contaError) {
        console.error('Erro ao atualizar conta:', contaError);
        throw new Error(`Erro ao atualizar conta: ${contaError.message}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar valor da geração:', error);
      throw error;
    }
  },

  getValorGeracao: async (contaFixaId: string, mes: string, signal?: AbortSignal): Promise<number | null> => {
    try {
      if (signal?.aborted) {
        throw new Error('Operação cancelada');
      }

      const { data, error } = await supabase
        .from('geracoes_mensais')
        .select('valor')
        .eq('conta_fixa_id', contaFixaId)
        .eq('mes', mes)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erro ao buscar valor da geração:', error);
        throw new Error(`Erro ao buscar valor da geração: ${error.message}`);
      }
      
      return data ? Number(data.valor) : null;
    } catch (error) {
      console.error('Erro ao buscar valor da geração:', error);
      throw error;
    }
  }
};