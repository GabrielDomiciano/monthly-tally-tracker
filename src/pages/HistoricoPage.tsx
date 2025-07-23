import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContaCard from '@/components/ContaCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { storage } from '@/lib/storage';
import { Conta, CATEGORIAS } from '@/types/conta';
import { formatCurrency, formatDate } from '@/lib/date-utils';
import { Search, Filter, Calendar, DollarSign, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HistoricoPage = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [contasFiltradas, setContasFiltradas] = useState<Conta[]>([]);
  const [filtros, setFiltros] = useState({
    busca: '',
    categoria: '',
    status: '',
    mes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    carregarContas();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [contas, filtros]);

  const carregarContas = () => {
    const todasContas = storage.getContas();
    // Ordenar por data mais recente
    const contasOrdenadas = todasContas.sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
    setContas(contasOrdenadas);
  };

  const aplicarFiltros = () => {
    let resultado = [...contas];

    // Filtro por busca (título)
    if (filtros.busca) {
      resultado = resultado.filter(conta =>
        conta.titulo.toLowerCase().includes(filtros.busca.toLowerCase())
      );
    }

    // Filtro por categoria
    if (filtros.categoria) {
      resultado = resultado.filter(conta => conta.categoria === filtros.categoria);
    }

    // Filtro por status
    if (filtros.status) {
      resultado = resultado.filter(conta => conta.status === filtros.status);
    }

    // Filtro por mês
    if (filtros.mes) {
      resultado = resultado.filter(conta => {
        const contaData = new Date(conta.data);
        const [ano, mes] = filtros.mes.split('-');
        return contaData.getFullYear() === parseInt(ano) && 
               contaData.getMonth() === parseInt(mes) - 1;
      });
    }

    setContasFiltradas(resultado);
  };

  const alternarStatus = (id: string) => {
    const conta = contas.find(c => c.id === id);
    if (conta) {
      const novoStatus = conta.status === 'pago' ? 'pendente' : 'pago';
      storage.updateConta(id, { status: novoStatus });
      carregarContas();
      
      toast({
        title: "Status atualizado",
        description: `Conta marcada como ${novoStatus}`,
      });
    }
  };

  const excluirConta = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      storage.deleteConta(id);
      carregarContas();
      
      toast({
        title: "Conta excluída",
        description: "A conta foi removida com sucesso",
      });
    }
  };

  const limparFiltros = () => {
    setFiltros({
      busca: '',
      categoria: '',
      status: '',
      mes: ''
    });
  };

  // Calcular totais
  const totalGeral = contasFiltradas.reduce((sum, conta) => sum + conta.valor, 0);
  const totalPago = contasFiltradas.filter(c => c.status === 'pago').reduce((sum, conta) => sum + conta.valor, 0);
  const totalPendente = contasFiltradas.filter(c => c.status === 'pendente').reduce((sum, conta) => sum + conta.valor, 0);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Histórico de Contas</h1>
            <p className="text-muted-foreground">Visualize e gerencie todas as suas contas</p>
          </div>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Geral</p>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(totalGeral)}</p>
                </div>
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-success/20 bg-success/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pago</p>
                  <p className="text-xl font-bold text-success">{formatCurrency(totalPago)}</p>
                </div>
                <div className="text-success">✓</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-warning/20 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendente</p>
                  <p className="text-xl font-bold text-warning">{formatCurrency(totalPendente)}</p>
                </div>
                <div className="text-warning">⏳</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Contas</p>
                  <p className="text-xl font-bold text-foreground">{contasFiltradas.length}</p>
                </div>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título..."
                  value={filtros.busca}
                  onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                  className="pl-10"
                />
              </div>

              <Select
                value={filtros.categoria}
                onValueChange={(value) => setFiltros(prev => ({ ...prev, categoria: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas categorias</SelectItem>
                  {CATEGORIAS.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filtros.status}
                onValueChange={(value) => setFiltros(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos status</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="month"
                value={filtros.mes}
                onChange={(e) => setFiltros(prev => ({ ...prev, mes: e.target.value }))}
                placeholder="Mês"
              />

              <Button
                variant="outline"
                onClick={limparFiltros}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Contas */}
        <div className="space-y-4">
          {contasFiltradas.length > 0 ? (
            contasFiltradas.map(conta => (
              <ContaCard
                key={conta.id}
                conta={conta}
                onToggleStatus={alternarStatus}
                onDelete={excluirConta}
              />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma conta encontrada</p>
                  <p className="text-sm">Tente ajustar os filtros ou adicionar novas contas</p>
                  {contas.length === 0 && (
                    <div className="mt-4">
                      <Link to="/contas">
                        <Button className="bg-gradient-primary hover:opacity-90">
                          <Plus className="h-4 w-4 mr-2" />
                          Cadastrar primeira conta
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoricoPage;