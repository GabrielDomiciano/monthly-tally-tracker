import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContaForm from '@/components/ContaForm';
import { Conta } from '@/types/conta';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const ContasPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editingConta, setEditingConta] = useState<Conta | null>(null);

  const handleSubmit = (contaData: Omit<Conta, 'id'>) => {
    try {
      if (editingConta) {
        storage.updateConta(editingConta.id, contaData);
        toast({
          title: "Conta atualizada",
          description: "A conta foi atualizada com sucesso!"
        });
      } else {
        storage.addConta(contaData);
        toast({
          title: "Conta adicionada",
          description: "Nova conta registrada com sucesso!"
        });
      }
      
      // Redirecionar para a página inicial após salvar
      navigate('/');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a conta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {editingConta ? 'Editar Conta' : 'Nova Conta'}
          </h1>
          <p className="text-muted-foreground">
            {editingConta 
              ? 'Atualize os dados da conta existente' 
              : 'Preencha os campos abaixo para adicionar uma nova conta'}
          </p>
        </div>

        <ContaForm 
          onSubmit={handleSubmit} 
          initialData={editingConta || undefined}
          isEditing={!!editingConta}
        />
      </div>
    </div>
  );
};

export default ContasPage;