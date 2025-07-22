import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContaFixaForm from '@/components/ContaFixaForm';
import GeradorContasMensais from '@/components/GeradorContasMensais';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContaFixa } from '@/types/conta-fixa';
import { storage } from '@/lib/storage';
import { formatCurrency } from '@/lib/date-utils';
import { Repeat, Plus, Edit, Trash2, Settings, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContasFixasPage = () => {
  const [contasFixas, setContasFixas] = useState<ContaFixa[]>([]);
  const [editingConta, setEditingConta] = useState<ContaFixa | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    carregarContasFixas();
  }, []);

  const carregarContasFixas = () => {
    const contas = storage.getContasFixas();
    setContasFixas(contas);
  };

  const handleSubmit = (contaData: Omit<ContaFixa, 'id'>) => {
    try {
      if (editingConta) {
        storage.updateContaFixa(editingConta.id, contaData);
        toast({
          title: "Conta fixa atualizada",
          description: "A conta fixa foi atualizada com sucesso!"
        });
      } else {
        storage.addContaFixa(contaData);
        toast({
          title: "Conta fixa adicionada",
          description: "Nova conta fixa registrada com sucesso!"
        });
      }
      
      carregarContasFixas();
      setShowForm(false);
      setEditingConta(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a conta fixa. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (conta: ContaFixa) => {
    setEditingConta(conta);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta conta fixa?')) {
      storage.deleteContaFixa(id);
      carregarContasFixas();
      
      toast({
        title: "Conta fixa excluída",
        description: "A conta fixa foi removida com sucesso",
      });
    }
  };

  const toggleAtivo = (id: string, ativo: boolean) => {
    storage.updateContaFixa(id, { ativo: !ativo });
    carregarContasFixas();
    
    toast({
      title: "Status atualizado",
      description: `Conta fixa ${!ativo ? 'ativada' : 'desativada'}`,
    });
  };

  const cancelarEdicao = () => {
    setShowForm(false);
    setEditingConta(null);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contas Fixas</h1>
            <p className="text-muted-foreground">Gerencie suas contas recorrentes</p>
          </div>
        </div>

        <Tabs defaultValue="gerador" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gerador" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Gerar Contas
            </TabsTrigger>
            <TabsTrigger value="configurar" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gerador" className="space-y-6">
            <GeradorContasMensais />
          </TabsContent>

          <TabsContent value="configurar" className="space-y-6">
            {showForm ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    {editingConta ? 'Editar Conta Fixa' : 'Nova Conta Fixa'}
                  </h2>
                  <Button variant="outline" onClick={cancelarEdicao}>
                    Cancelar
                  </Button>
                </div>
                <ContaFixaForm 
                  onSubmit={handleSubmit} 
                  initialData={editingConta || undefined}
                  isEditing={!!editingConta}
                />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Suas Contas Fixas</h2>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Conta Fixa
                  </Button>
                </div>

                {contasFixas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contasFixas.map(conta => (
                      <Card key={conta.id} className={`transition-all duration-300 hover:shadow-elegant ${!conta.ativo ? 'opacity-60' : ''}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                                <Repeat className="h-4 w-4 text-primary" />
                                {conta.titulo}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {conta.categoria}
                                </Badge>
                                <Badge 
                                  variant={conta.ativo ? "default" : "secondary"}
                                  className={`text-xs cursor-pointer ${conta.ativo ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}
                                  onClick={() => toggleAtivo(conta.id, conta.ativo)}
                                >
                                  {conta.ativo ? 'Ativo' : 'Inativo'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-2xl font-bold text-primary">
                              {formatCurrency(conta.valorPadrao)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Vencimento: dia {conta.diaVencimento}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(conta)}
                              className="flex-1"
                            >
                              <Edit className="h-3 w-3 mr-2" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(conta.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Repeat className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma conta fixa cadastrada</h3>
                      <p className="text-muted-foreground mb-4">
                        Configure suas contas recorrentes para gerar automaticamente a cada mês
                      </p>
                      <Button 
                        onClick={() => setShowForm(true)}
                        className="bg-gradient-primary hover:opacity-90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Criar primeira conta fixa
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContasFixasPage;