import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CATEGORIAS, Conta } from '@/types/conta';
import { CheckCircle, Clock, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

const contaSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
  data: z.string().min(1, 'Data é obrigatória'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  status: z.enum(['pago', 'pendente'])
});

type ContaFormData = z.infer<typeof contaSchema>;

interface ContaFormProps {
  onSubmit: (data: Omit<Conta, 'id'>) => void;
  initialData?: Conta;
  isEditing?: boolean;
}

const ContaForm = ({ onSubmit, initialData, isEditing = false }: ContaFormProps) => {
  const [status, setStatus] = useState<'pago' | 'pendente'>(initialData?.status || 'pendente');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ContaFormData>({
    resolver: zodResolver(contaSchema),
    defaultValues: initialData ? {
      titulo: initialData.titulo,
      valor: initialData.valor,
      data: initialData.data,
      categoria: initialData.categoria,
      status: initialData.status
    } : {
      data: new Date().toISOString().split('T')[0],
      status: 'pendente'
    }
  });

  const watchedCategoria = watch('categoria');

  const handleFormSubmit = (data: ContaFormData) => {
    onSubmit({
      titulo: data.titulo,
      valor: data.valor,
      data: data.data,
      categoria: data.categoria,
      status
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          {isEditing ? 'Editar Conta' : 'Nova Conta'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                {...register('titulo')}
                placeholder="Ex: Conta de luz"
                className={errors.titulo ? 'border-destructive' : ''}
              />
              {errors.titulo && (
                <p className="text-sm text-destructive">{errors.titulo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                {...register('valor', { valueAsNumber: true })}
                placeholder="0,00"
                className={errors.valor ? 'border-destructive' : ''}
              />
              {errors.valor && (
                <p className="text-sm text-destructive">{errors.valor.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                {...register('data')}
                className={errors.data ? 'border-destructive' : ''}
              />
              {errors.data && (
                <p className="text-sm text-destructive">{errors.data.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={watchedCategoria}
                onValueChange={(value) => setValue('categoria', value)}
              >
                <SelectTrigger className={errors.categoria ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria && (
                <p className="text-sm text-destructive">{errors.categoria.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Status</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Badge
                variant={status === 'pendente' ? 'default' : 'secondary'}
                className={cn(
                  'cursor-pointer px-4 py-2 transition-all duration-200 text-center',
                  status === 'pendente' 
                    ? 'bg-warning text-warning-foreground shadow-md' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
                onClick={() => setStatus('pendente')}
              >
                <Clock className="h-3 w-3 mr-1" />
                Pendente
              </Badge>
              <Badge
                variant={status === 'pago' ? 'default' : 'secondary'}
                className={cn(
                  'cursor-pointer px-4 py-2 transition-all duration-200 text-center',
                  status === 'pago' 
                    ? 'bg-success text-success-foreground shadow-md' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
                onClick={() => setStatus('pago')}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Pago
              </Badge>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar Conta')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContaForm;