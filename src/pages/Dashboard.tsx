import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ResumoCard from '@/components/ResumoCard';
import ContaCard from '@/components/ContaCard';
import PrimeiroUso from '@/components/PrimeiroUso';
import ConfiguracoesDados from '@/components/ConfiguracoesDados';
import { Loading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { storage } from '@/lib/storage';
import { adicionarContasExemplo } from '@/lib/sample-data';
import { getCurrentMonth, getPreviousMonth, isDateInMonth, formatCurrency, getMonthName } from '@/lib/date-utils';
import { Conta, ResumoMensal } from '@/types/conta';
import { DollarSign, Clock, CheckCircle, Receipt, Plus, TrendingUp, Repeat, Settings, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mesSelecionado, setMesSelecionado] = useState<string>('atual');
  const [resumoAtual, setResumoAtual] = useState<ResumoMensal>({
    total: 0,
    pago: 0,
    pendente: 0,
    totalContas: 0
  });
  const [resumoAnterior, setResumoAnterior] = useState<ResumoMensal>({
    total: 0,
    pago: 0,
    pendente: 0,
    totalContas: 0
  });
  const [temDados, setTemDados] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Gerar opções de meses (próximos 3 meses + atual + últimos 12 meses)
  const gerarOpcoesMeses = () => {
    const opcoes = [];
    const hoje = new Date();
    
    // Próximos 3 meses (primeiro)
    for (let i = 3; i >= 1; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
      opcoes.push({
        value: `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`,
        label: `${getMonthName(data)} (Próximo)`
      });
    }
    
    // Mês atual (meio)
    opcoes.push({
      value: 'atual',
      label: `${getMonthName(hoje)} (Atual)`
    });
    
    // Últimos 12 meses (por último)
    for (let i = 1; i <= 12; i++) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      opcoes.push({
        value: `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`,
        label: getMonthName(data)
      });
    }
    
    return opcoes;
  };

  const obterPeriodoMensal = (mesValue: string) => {
    if (mesValue === 'atual') {
      return getCurrentMonth();
    }
    
    const [ano, mes] = mesValue.split('-');
    const data = new Date(parseInt(ano), parseInt(mes) - 1, 1);
    const inicio = new Date(data.getFullYear(), data.getMonth(), 1);
    const fim = new Date(data.getFullYear(), data.getMonth() + 1, 0);
    
    return { start: inicio, end: fim };
  };

  const obterPeriodoMensalAnterior = (mesValue: string) => {
    if (mesValue === 'atual') {
      return getPreviousMonth();
    }
    
    const [ano, mes] = mesValue.split('-');
    const data = new Date(parseInt(ano), parseInt(mes) - 2, 1);
    const inicio = new Date(data.getFullYear(), data.getMonth(), 1);
    const fim = new Date(data.getFullYear(), data.getMonth() + 1, 0);
    
    return { start: inicio, end: fim };
  };

  const isMesFuturo = (mesValue: string) => {
    if (mesValue === 'atual') return false;
    
    const [ano, mes] = mesValue.split('-');
    const dataMes = new Date(parseInt(ano), parseInt(mes) - 1, 1);
    const hoje = new Date();
    const inicioMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    return dataMes > inicioMesAtual;
  };

  const obterLabelMes = (mesValue: string) => {
    if (mesValue === 'atual') return 'Mês Atual';
    
    const opcoes = gerarOpcoesMeses();
    const opcao = opcoes.find(o => o.value === mesValue);
    return opcao?.label || 'Mês Selecionado';
  };

  const carregarDados = async () => {
    try {
      const todasContas = await storage.getContas();
      const mesAtual = obterPeriodoMensal(mesSelecionado);
      const mesAnterior = obterPeriodoMensalAnterior(mesSelecionado);

      const contasAtual = todasContas.filter(conta => 
        isDateInMonth(conta.data, mesAtual.start, mesAtual.end)
      );

      const contasAnterior = todasContas.filter(conta => 
        isDateInMonth(conta.data, mesAnterior.start, mesAnterior.end)
      );

      setContas(contasAtual.slice(0, 15));

      // Calcular resumo do mês selecionado
      const totalAtual = contasAtual.reduce((sum, conta) => sum + conta.valor, 0);
      const pagoAtual = contasAtual.filter(c => c.status === 'pago').reduce((sum, conta) => sum + conta.valor, 0);
      const pendenteAtual = contasAtual.filter(c => c.status === 'pendente').reduce((sum, conta) => sum + conta.valor, 0);

      setResumoAtual({
        total: totalAtual,
        pago: pagoAtual,
        pendente: pendenteAtual,
        totalContas: contasAtual.length
      });

      // Calcular resumo do mês anterior
      const totalAnterior = contasAnterior.reduce((sum, conta) => sum + conta.valor, 0);
      const pagoAnterior = contasAnterior.filter(c => c.status === 'pago').reduce((sum, conta) => sum + conta.valor, 0);
      const pendenteAnterior = contasAnterior.filter(c => c.status === 'pendente').reduce((sum, conta) => sum + conta.valor, 0);

      setResumoAnterior({
        total: totalAnterior,
        pago: pagoAnterior,
        pendente: pendenteAnterior,
        totalContas: contasAnterior.length
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados');
    }
  };

  const verificarDados = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const todasContas = await storage.getContas();
      const contasFixas = await storage.getContasFixas();
      const temDadosExistentes = todasContas.length > 0 || contasFixas.length > 0;
      
      // Se não tem dados, adiciona dados de exemplo automaticamente
      if (!temDadosExistentes) {
        console.log('Nenhum dado encontrado, adicionando dados de exemplo...');
        await adicionarContasExemplo();
        // Recarrega os dados após adicionar
        const novasContas = await storage.getContas();
        const novasContasFixas = await storage.getContasFixas();
        const temDadosAgora = novasContas.length > 0 || novasContasFixas.length > 0;
        setTemDados(temDadosAgora);
        
        if (temDadosAgora) {
          await carregarDados();
        }
      } else {
        setTemDados(temDadosExistentes);
        await carregarDados();
      }
    } catch (error) {
      console.error('Erro ao verificar dados:', error);
      setError('Erro ao verificar dados');
      setTemDados(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verificarDados();
  }, []);

  // Recarregar dados quando mudar o mês selecionado
  useEffect(() => {
    if (temDados) {
      carregarDados();
    }
  }, [mesSelecionado]);

  // Adicionar listener para recarregar quando a página ganhar foco (útil quando alterar em outra aba)
  useEffect(() => {
    const handleFocus = () => {
      if (temDados) {
        carregarDados();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && temDados) {
        carregarDados();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [temDados]);

  const alternarStatus = async (id: string) => {
    const conta = contas.find(c => c.id === id);
    if (conta) {
      try {
        const novoStatus = conta.status === 'pago' ? 'pendente' : 'pago';
        await storage.updateConta(id, { status: novoStatus });
        await verificarDados();
        
        toast({
          title: "Status atualizado",
          description: `Conta marcada como ${novoStatus}`,
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o status da conta",
          variant: "destructive"
        });
      }
    }
  };

  const calcularVariacao = (atual: number, anterior: number) => {
    if (anterior === 0) return { value: "Primeiro mês", type: "neutral" as const };
    
    const percentual = ((atual - anterior) / anterior) * 100;
    const isIncrease = percentual > 0;
    
    return {
      value: `${isIncrease ? '+' : ''}${percentual.toFixed(1)}% vs mês anterior`,
      type: isIncrease ? 'increase' as const : 'decrease' as const
    };
  };

  const adicionarDadosExemplo = async () => {
    try {
      await adicionarContasExemplo();
      await verificarDados();
      toast({
        title: "Dados de exemplo adicionados",
        description: "Agora você pode explorar o sistema com dados de exemplo",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar dados de exemplo",
        variant: "destructive"
      });
    }
  };

  // Mostrar loading enquanto verifica se tem dados
  if (temDados === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading 
          isLoading={true} 
          text="Verificando dados..."
          size="lg"
        />
      </div>
    );
  }

  // Se não tem dados, mostra tela de primeiro uso
  if (!temDados) {
    return (
      <div className="min-h-screen bg-background p-4">
        <PrimeiroUso onAddSampleData={adicionarDadosExemplo} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 space-y-4 sm:space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Financeiro</h1>
            <p className="text-muted-foreground">Visão geral das suas contas mensais</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowConfig(!showConfig)}
              size="sm"
              className="w-full sm:w-auto"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
            <Link to="/contas" className="w-full sm:w-auto">
              <Button className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Nova Conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Filtro de Mês */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filtrar por mês:</span>
            <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                {gerarOpcoesMeses().map((opcao) => (
                  <SelectItem key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isMesFuturo(mesSelecionado) && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-md">
                <span className="text-xs text-blue-700 font-medium">Planejamento</span>
              </div>
            )}
          </div>
          
          {/* Dica para meses futuros */}
          {isMesFuturo(mesSelecionado) && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="text-blue-600 mt-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Modo Planejamento</p>
                  <p className="text-xs mt-1">
                    Visualize e planeje suas contas para meses futuros. Use as contas fixas para gerar contas automaticamente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Configurações de Dados */}
        {showConfig && (
          <div className="mb-6 sm:mb-8">
            <ConfiguracoesDados onDataChange={verificarDados} />
          </div>
        )}

        {/* Cards de Resumo */}
        <Loading 
          isLoading={isLoading} 
          error={error} 
          onRetry={verificarDados}
          className="mb-6 sm:mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <ResumoCard
              title="Total do Mês"
              value={formatCurrency(resumoAtual.total)}
              icon={DollarSign}
              change={calcularVariacao(resumoAtual.total, resumoAnterior.total)}
              variant="default"
            />
            
            <ResumoCard
              title="Valor Pago"
              value={formatCurrency(resumoAtual.pago)}
              icon={CheckCircle}
              change={calcularVariacao(resumoAtual.pago, resumoAnterior.pago)}
              variant="success"
            />
            
            <ResumoCard
              title="Valor Pendente"
              value={formatCurrency(resumoAtual.pendente)}
              icon={Clock}
              change={calcularVariacao(resumoAtual.pendente, resumoAnterior.pendente)}
              variant="warning"
            />
            
            <ResumoCard
              title="Total de Contas"
              value={resumoAtual.totalContas.toString()}
              icon={Receipt}
              change={{
                value: `${resumoAnterior.totalContas} no mês anterior`,
                type: 'neutral'
              }}
              variant="default"
            />
          </div>
        </Loading>

        {/* Contas Recentes */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Contas do Mês
                {mesSelecionado !== 'atual' && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({obterLabelMes(mesSelecionado)})
                  </span>
                )}
              </h2>
              <Link to="/historico" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Ver Todas
                </Button>
              </Link>
            </div>
            
            <Loading 
              isLoading={isLoading} 
              error={error} 
              onRetry={verificarDados}
            >
              <div className="space-y-4">
                {contas.length > 0 ? (
                  contas.map(conta => (
                    <ContaCard
                      key={conta.id}
                      conta={conta}
                      onToggleStatus={alternarStatus}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    {isMesFuturo(mesSelecionado) ? (
                      <>
                        <p>Nenhuma conta planejada para este mês</p>
                        <p className="text-sm mt-2">Use as contas fixas para gerar contas automaticamente</p>
                        <Link to="/contas-fixas">
                          <Button className="mt-4 bg-gradient-primary hover:opacity-90">
                            <Repeat className="h-4 w-4 mr-2" />
                            Configurar Contas Fixas
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <p>Nenhuma conta cadastrada neste mês</p>
                        <Link to="/contas">
                          <Button className="mt-4 bg-gradient-primary hover:opacity-90">
                            Cadastrar primeira conta
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Loading>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Ações Rápidas</h2>
            
            <div className="space-y-3">
              <Link to="/contas" className="block">
                <Button className="w-full bg-gradient-primary hover:opacity-90 justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Conta
                </Button>
              </Link>
              
              <Link to="/contas-fixas" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Repeat className="h-4 w-4 mr-2" />
                  Contas Fixas
                </Button>
              </Link>
              
              <Link to="/historico" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Receipt className="h-4 w-4 mr-2" />
                  Ver Histórico
                </Button>
              </Link>
              
              <Link to="/graficos" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Ver Gráficos
                </Button>
              </Link>
            </div>

            {/* Status Overview */}
            <div className="bg-gradient-secondary p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-3">Status do Mês</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contas Pagas:</span>
                  <span className="text-success font-medium">
                    {contas.filter(c => c.status === 'pago').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pendentes:</span>
                  <span className="text-warning font-medium">
                    {contas.filter(c => c.status === 'pendente').length}
                  </span>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total:</span>
                    <span className="text-foreground">{contas.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;