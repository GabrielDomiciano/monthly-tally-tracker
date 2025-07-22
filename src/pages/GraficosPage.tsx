import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/storage';
import { Conta } from '@/types/conta';
import { formatCurrency } from '@/lib/date-utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Calendar } from 'lucide-react';

interface DadosGrafico {
  categorias: Array<{ name: string; value: number; fill: string }>;
  evolucaoMensal: Array<{ mes: string; total: number; pago: number; pendente: number }>;
  statusDistribuicao: Array<{ name: string; value: number; fill: string }>;
}

const CORES = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

const GraficosPage = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [dadosGrafico, setDadosGrafico] = useState<DadosGrafico>({
    categorias: [],
    evolucaoMensal: [],
    statusDistribuicao: []
  });
  const [filtroMes, setFiltroMes] = useState<string>('');
  const [mesesDisponiveis, setMesesDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    processarDadosGrafico();
  }, [contas, filtroMes]);

  const carregarDados = () => {
    const todasContas = storage.getContas();
    setContas(todasContas);

    // Extrair meses únicos
    const meses = Array.from(new Set(
      todasContas.map(conta => {
        const data = new Date(conta.data);
        return `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}`;
      })
    )).sort().reverse();
    
    setMesesDisponiveis(meses);
  };

  const processarDadosGrafico = () => {
    let contasFiltradas = contas;

    // Aplicar filtro de mês se selecionado
    if (filtroMes) {
      contasFiltradas = contas.filter(conta => {
        const data = new Date(conta.data);
        const contaMes = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}`;
        return contaMes === filtroMes;
      });
    }

    // Dados por categoria
    const categoriasMap = new Map<string, number>();
    contasFiltradas.forEach(conta => {
      const atual = categoriasMap.get(conta.categoria) || 0;
      categoriasMap.set(conta.categoria, atual + conta.valor);
    });

    const categorias = Array.from(categoriasMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        fill: CORES[index % CORES.length]
      }))
      .sort((a, b) => b.value - a.value);

    // Evolução mensal
    const evolucaoMap = new Map<string, { total: number; pago: number; pendente: number }>();
    
    contas.forEach(conta => {
      const data = new Date(conta.data);
      const mes = data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      const atual = evolucaoMap.get(mes) || { total: 0, pago: 0, pendente: 0 };
      atual.total += conta.valor;
      
      if (conta.status === 'pago') {
        atual.pago += conta.valor;
      } else {
        atual.pendente += conta.valor;
      }
      
      evolucaoMap.set(mes, atual);
    });

    const evolucaoMensal = Array.from(evolucaoMap.entries())
      .map(([mes, dados]) => ({ mes, ...dados }))
      .sort((a, b) => new Date(a.mes).getTime() - new Date(b.mes).getTime())
      .slice(-6); // Últimos 6 meses

    // Distribuição por status
    const totalPago = contasFiltradas.filter(c => c.status === 'pago').reduce((sum, c) => sum + c.valor, 0);
    const totalPendente = contasFiltradas.filter(c => c.status === 'pendente').reduce((sum, c) => sum + c.valor, 0);

    const statusDistribuicao = [
      { name: 'Pago', value: totalPago, fill: '#10b981' },
      { name: 'Pendente', value: totalPendente, fill: '#f59e0b' }
    ].filter(item => item.value > 0);

    setDadosGrafico({
      categorias,
      evolucaoMensal,
      statusDistribuicao
    });
  };

  const formatarTooltip = (value: number) => formatCurrency(value);

  const formatarMes = (mes: string) => {
    const meses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    
    if (meses.includes(mes.split(' ')[0])) {
      return mes;
    }
    
    const [ano, mesNum] = mes.split('-');
    return `${meses[parseInt(mesNum) - 1]} ${ano}`;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gráficos e Análises</h1>
            <p className="text-muted-foreground">Visualize seus dados financeiros de forma clara</p>
          </div>

          {/* Filtro de Mês */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={filtroMes} onValueChange={setFiltroMes}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todos os meses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os meses</SelectItem>
                {mesesDisponiveis.map(mes => (
                  <SelectItem key={mes} value={mes}>
                    {formatarMes(mes)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filtroMes && (
              <Button variant="outline" size="sm" onClick={() => setFiltroMes('')}>
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Grid de Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Categorias (Pizza) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Gastos por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dadosGrafico.categorias.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosGrafico.categorias}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosGrafico.categorias.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={formatarTooltip} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de Status (Pizza) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Status dos Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dadosGrafico.statusDistribuicao.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosGrafico.statusDistribuicao}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosGrafico.statusDistribuicao.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={formatarTooltip} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Evolução Mensal (Linha) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Evolução Mensal dos Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dadosGrafico.evolucaoMensal.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dadosGrafico.evolucaoMensal}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={formatarTooltip}
                  />
                  <Tooltip 
                    formatter={formatarTooltip}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Total"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pago" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Pago"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pendente" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Pendente"
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível para evolução mensal
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Barras por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Ranking de Categorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dadosGrafico.categorias.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGrafico.categorias}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={formatarTooltip}
                  />
                  <Tooltip 
                    formatter={formatarTooltip}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                    }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GraficosPage;