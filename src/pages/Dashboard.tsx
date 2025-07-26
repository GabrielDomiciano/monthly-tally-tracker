import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ResumoCard from '@/components/ResumoCard';
import ContaCard from '@/components/ContaCard';
import PrimeiroUso from '@/components/PrimeiroUso';
import ConfiguracoesDados from '@/components/ConfiguracoesDados';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/storage';
import { adicionarContasExemplo } from '@/lib/sample-data';
import { getCurrentMonth, getPreviousMonth, isDateInMonth, formatCurrency } from '@/lib/date-utils';
import { Conta, ResumoMensal } from '@/types/conta';
import { DollarSign, Clock, CheckCircle, Receipt, Plus, TrendingUp, Repeat, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [showConfig, setShowConfig] = useState(false);
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
  const { toast } = useToast();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const todasContas = await storage.getContas();
    const mesAtual = getCurrentMonth();
    const mesAnterior = getPreviousMonth();

    const contasAtual = todasContas.filter(conta => 
      isDateInMonth(conta.data, mesAtual.start, mesAtual.end)
    );

    const contasAnterior = todasContas.filter(conta => 
      isDateInMonth(conta.data, mesAnterior.start, mesAnterior.end)
    );

    setContas(contasAtual.slice(0, 5)); // Últimas 5 contas

    // Calcular resumo do mês atual
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
  };

  const alternarStatus = async (id: string) => {
    const conta = contas.find(c => c.id === id);
    if (conta) {
      const novoStatus = conta.status === 'pago' ? 'pendente' : 'pago';
      await storage.updateConta(id, { status: novoStatus });
      await carregarDados();
      
      toast({
        title: "Status atualizado",
        description: `Conta marcada como ${novoStatus}`,
      });
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
    await adicionarContasExemplo();
    await carregarDados();
    toast({
      title: "Dados de exemplo adicionados",
      description: "Agora você pode explorar o sistema com dados de exemplo",
    });
  };

  const [temDados, setTemDados] = useState(false);

  useEffect(() => {
    const verificarDados = async () => {
      const todasContas = await storage.getContas();
      const contasFixas = await storage.getContasFixas();
      setTemDados(todasContas.length > 0 || contasFixas.length > 0);
    };
    verificarDados();
  }, []);

  // Se não tem dados, mostra tela de primeiro uso
  if (!temDados) {
    return (
      <div className="min-h-screen bg-background p-4">
        <PrimeiroUso onAddSampleData={adicionarDadosExemplo} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Financeiro</h1>
            <p className="text-muted-foreground">Visão geral das suas contas mensais</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowConfig(!showConfig)}
              size="sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
            <Link to="/contas">
              <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Nova Conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Configurações de Dados */}
        {showConfig && (
          <div className="mb-8">
            <ConfiguracoesDados onDataChange={carregarDados} />
          </div>
        )}

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Contas Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Contas Recentes</h2>
              <Link to="/historico">
                <Button variant="outline" size="sm">
                  Ver Todas
                </Button>
              </Link>
            </div>
            
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
                  <p>Nenhuma conta cadastrada este mês</p>
                  <Link to="/contas">
                    <Button className="mt-4 bg-gradient-primary hover:opacity-90">
                      Cadastrar primeira conta
                    </Button>
                  </Link>
                </div>
              )}
            </div>
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