import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';
import { ContaFixa } from '@/types/conta-fixa';
import { formatCurrency } from '@/lib/date-utils';
import { Calendar, DollarSign, Zap, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContaParaGerar extends ContaFixa {
  valorAjustado: number;
  jaGerada: boolean;
}

const GeradorContasMensais = () => {
  const [contasFixas, setContasFixas] = useState<ContaParaGerar[]>([]);
  const [loading, setLoading] = useState(true);
  const [mesGeracao, setMesGeracao] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Definir mês atual por padrão
    const agora = new Date();
    const mesAtual = `${agora.getFullYear()}-${(agora.getMonth() + 1).toString().padStart(2, '0')}`;
    setMesGeracao(mesAtual);
    
    carregarContasFixas(mesAtual);
  }, []);

  const carregarContasFixas = async (mes: string) => {
    try {
      setLoading(true);
      const contasFixasBase = (await storage.getContasFixas()).filter(cf => cf.ativo);
      
      const contasParaGerar: ContaParaGerar[] = await Promise.all(
        contasFixasBase.map(async conta => {
          const jaGerada = await storage.jaGeradoNoMes(conta.id, mes);
          let valorAjustado = conta.valorPadrao;
          
          // Se já foi gerada, buscar o valor da geração mensal
          if (jaGerada) {
            const valorGeracao = await storage.getValorGeracao(conta.id, mes);
            valorAjustado = valorGeracao || conta.valorPadrao;
          }
          
          return {
            ...conta,
            valorAjustado,
            jaGerada
          };
        })
      );

      setContasFixas(contasParaGerar);
    } finally {
      setLoading(false);
    }
  };

  const atualizarValor = async (id: string, novoValor: number) => {
    setContasFixas(prev => prev.map(conta => 
      conta.id === id ? { ...conta, valorAjustado: novoValor } : conta
    ));

    // Se a conta já foi gerada, atualizar o valor na base de dados
    const conta = contasFixas.find(c => c.id === id);
    if (conta?.jaGerada) {
      try {
        await storage.atualizarValorGeracao(id, mesGeracao, novoValor);
        toast({
          title: "Valor atualizado",
          description: `Valor de ${conta.titulo} foi atualizado para ${formatCurrency(novoValor)}`,
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o valor",
          variant: "destructive"
        });
      }
    }
  };

  const gerarContasDoMes = async () => {
    if (!mesGeracao) {
      toast({
        title: "Erro",
        description: "Selecione um mês para gerar as contas",
        variant: "destructive"
      });
      return;
    }

    const contasNaoGeradas = contasFixas.filter(c => !c.jaGerada);
    
    if (contasNaoGeradas.length === 0) {
      toast({
        title: "Atenção",
        description: "Todas as contas fixas já foram geradas para este mês",
        variant: "destructive"
      });
      return;
    }

    let contasGeradas = 0;

    for (const contaFixa of contasNaoGeradas) {
      const [ano, mes] = mesGeracao.split('-');
      const diaVencimento = Math.min(contaFixa.diaVencimento, new Date(parseInt(ano), parseInt(mes), 0).getDate());
      const dataVencimento = `${ano}-${mes}-${diaVencimento.toString().padStart(2, '0')}`;

      // Adicionar a conta regular
      await storage.addConta({
        titulo: contaFixa.titulo,
        valor: contaFixa.valorAjustado,
        data: dataVencimento,
        categoria: contaFixa.categoria,
        status: 'pendente'
      });

      // Marcar como gerada
      await storage.marcarComoGerado(contaFixa.id, mesGeracao, contaFixa.valorAjustado);
      contasGeradas++;
    }

    toast({
      title: "Contas geradas!",
      description: `${contasGeradas} conta(s) foram adicionadas ao mês ${mesGeracao}`,
    });

    // Recarregar para atualizar status
    await carregarContasFixas(mesGeracao);
  };

  const handleMesChange = (novoMes: string) => {
    setMesGeracao(novoMes);
    carregarContasFixas(novoMes);
  };

  const totalPrevisto = contasFixas.reduce((sum, conta) => sum + conta.valorAjustado, 0);
  const totalNaoGerado = contasFixas.filter(c => !c.jaGerada).reduce((sum, conta) => sum + conta.valorAjustado, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Gerar Contas do Mês
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mes">Mês de Geração</Label>
              <Input
                id="mes"
                type="month"
                value={mesGeracao}
                onChange={(e) => handleMesChange(e.target.value)}
              />
            </div>

            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Previsto</div>
              <div className="text-lg sm:text-xl font-bold text-foreground">
                {formatCurrency(totalPrevisto)}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm text-muted-foreground">A Gerar</div>
              <div className="text-lg sm:text-xl font-bold text-primary">
                {formatCurrency(totalNaoGerado)}
              </div>
            </Card>
          </div>

          {contasFixas.length > 0 && (
            <Button 
              onClick={gerarContasDoMes}
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold"
              disabled={contasFixas.every(c => c.jaGerada)}
            >
              <Zap className="h-4 w-4 mr-2" />
              Gerar Contas do Mês ({contasFixas.filter(c => !c.jaGerada).length})
            </Button>
          )}
        </CardContent>
      </Card>

      {contasFixas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Contas a Gerar</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg animate-pulse">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 bg-muted rounded w-32"></div>
                      <div className="h-4 w-4 bg-muted rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {contasFixas.map(conta => (
                  <div key={conta.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate">{conta.titulo}</h4>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {conta.categoria}
                          </Badge>
                          {conta.jaGerada && (
                            <Badge className="text-xs bg-success text-success-foreground">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Gerada
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Vencimento: dia {conta.diaVencimento}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Label htmlFor={`valor-${conta.id}`} className="text-xs text-muted-foreground">
                          Valor
                        </Label>
                        <Input
                          id={`valor-${conta.id}`}
                          type="number"
                          step="0.01"
                          value={conta.valorAjustado}
                          onChange={(e) => atualizarValor(conta.id, parseFloat(e.target.value) || 0)}
                          className="w-32 text-right"
                        />
                      </div>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {contasFixas.length === 0 && (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma conta fixa ativa</h3>
            <p className="text-muted-foreground mb-4">
              Configure suas contas fixas para gerar automaticamente a cada mês
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeradorContasMensais;