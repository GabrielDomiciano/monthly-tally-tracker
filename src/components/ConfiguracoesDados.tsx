import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { storage } from '@/lib/storage';
import { adicionarContasExemplo } from '@/lib/sample-data';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, Trash2, Database, FileText } from 'lucide-react';

interface ConfiguracoesDadosProps {
  onDataChange?: () => void;
}

const ConfiguracoesDados = ({ onDataChange }: ConfiguracoesDadosProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const limparTodosDados = () => {
    storage.setContas([]);
    storage.setContasFixas([]);
    storage.setGeracoesMensais([]);
    
    toast({
      title: "Dados removidos",
      description: "Todos os dados foram removidos com sucesso",
    });
    
    onDataChange?.();
  };

  const adicionarDadosExemplo = () => {
    const foiAdicionado = adicionarContasExemplo();
    
    if (foiAdicionado) {
      toast({
        title: "Dados de exemplo adicionados",
        description: "Contas e contas fixas de exemplo foram adicionadas",
      });
      onDataChange?.();
    } else {
      toast({
        title: "Dados já existem",
        description: "Você já possui contas cadastradas",
        variant: "destructive"
      });
    }
  };

  const exportarDados = () => {
    setIsExporting(true);
    
    try {
      const dados = {
        contas: storage.getContas(),
        contasFixas: storage.getContasFixas(),
        geracoesMensais: storage.getGeracoesMensais(),
        exportadoEm: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(dados, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contas-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup criado",
        description: "Seus dados foram exportados com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro no backup",
        description: "Não foi possível exportar os dados",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const importarDados = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dados = JSON.parse(e.target?.result as string);
        
        if (dados.contas && dados.contasFixas && dados.geracoesMensais) {
          storage.setContas(dados.contas);
          storage.setContasFixas(dados.contasFixas);
          storage.setGeracoesMensais(dados.geracoesMensais);
          
          toast({
            title: "Dados importados",
            description: "Backup restaurado com sucesso",
          });
          
          onDataChange?.();
        } else {
          throw new Error('Formato inválido');
        }
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "Arquivo de backup inválido",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  const obterEstatisticas = () => {
    const contas = storage.getContas();
    const contasFixas = storage.getContasFixas();
    const geracoes = storage.getGeracoesMensais();
    
    return {
      totalContas: contas.length,
      totalContasFixas: contasFixas.length,
      totalGeracoes: geracoes.length,
      valorTotal: contas.reduce((sum, conta) => sum + conta.valor, 0)
    };
  };

  const stats = obterEstatisticas();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Gerenciar Dados
        </CardTitle>
        <CardDescription>
          Faça backup, importe dados ou limpe o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="backup">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="reset">Reset</TabsTrigger>
          </TabsList>
          
          <TabsContent value="backup" className="space-y-4">
            <div className="space-y-3">
              <Button 
                onClick={exportarDados} 
                disabled={isExporting}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Exportando...' : 'Exportar Dados'}
              </Button>
              
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={importarDados}
                  style={{ display: 'none' }}
                  id="import-file"
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => document.getElementById('import-file')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Backup
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contas:</span>
                  <span className="font-medium">{stats.totalContas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contas Fixas:</span>
                  <span className="font-medium">{stats.totalContasFixas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gerações:</span>
                  <span className="font-medium">{stats.totalGeracoes}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Valor Total:</span>
                  <span className="font-medium">
                    R$ {stats.valorTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reset" className="space-y-4">
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={adicionarDadosExemplo}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Adicionar Dados de Exemplo
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Todos os Dados
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Limpeza</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação removerá TODOS os dados do sistema permanentemente. 
                      Recomendamos fazer um backup antes de continuar.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={limparTodosDados}>
                      Confirmar Limpeza
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ConfiguracoesDados;