import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Plus, Repeat, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PrimeiroUsoProps {
  onAddSampleData: () => void;
}

const PrimeiroUso = ({ onAddSampleData }: PrimeiroUsoProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 p-4">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Bem-vindo ao Controle de Contas! 🎉
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Vamos começar organizando suas finanças de forma simples e eficiente
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5 text-primary" />
              1. Configure Contas Fixas
            </CardTitle>
            <CardDescription>
              Primeiro, cadastre suas contas que se repetem todo mês (aluguel, internet, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/contas-fixas">
              <Button className="w-full bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Contas Fixas
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              2. Adicione Contas do Mês
            </CardTitle>
            <CardDescription>
              Depois, cadastre contas específicas do mês atual ou use o gerador automático
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/contas">
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Nova Conta
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed border-2 border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Ou experimente primeiro com dados de exemplo
          </CardTitle>
          <CardDescription>
            Se preferir, pode começar com algumas contas de exemplo para conhecer o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={onAddSampleData}
            className="w-full"
          >
            Adicionar Dados de Exemplo
          </Button>
        </CardContent>
      </Card>

      <div className="bg-gradient-secondary p-4 sm:p-6 rounded-lg">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" />
          Como usar o sistema:
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p>• <strong>Contas Fixas:</strong> Configure uma vez, gere automaticamente todo mês</p>
            <p>• <strong>Contas Avulsas:</strong> Cadastre contas específicas conforme aparecem</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>Dashboard:</strong> Veja resumo e totais do mês atual</p>
            <p>• <strong>Gráficos:</strong> Compare gastos entre meses e categorias</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimeiroUso;