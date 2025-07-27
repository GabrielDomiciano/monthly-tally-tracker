import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CATEGORIAS } from '@/types/conta';
import { ContaFixa } from '@/types/conta-fixa';
import { Save, Repeat } from 'lucide-react';

const contaFixaSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  valorPadrao: z.number().min(0.01, 'Valor deve ser maior que zero'),
  diaVencimento: z.number().min(1, 'Dia deve ser entre 1 e 31').max(31, 'Dia deve ser entre 1 e 31'),
  ativo: z.boolean()
});

type ContaFixaFormData = z.infer<typeof contaFixaSchema>;

interface ContaFixaFormProps {
  onSubmit: (data: Omit<ContaFixa, 'id'>) => void;
  initialData?: ContaFixa;
  isEditing?: boolean;
}

const ContaFixaForm = ({ onSubmit, initialData, isEditing = false }: ContaFixaFormProps) => {
  const [ativo, setAtivo] = useState<boolean>(initialData?.ativo ?? true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ContaFixaFormData>({
    resolver: zodResolver(contaFixaSchema),
    defaultValues: initialData ? {
      titulo: initialData.titulo,
      categoria: initialData.categoria,
      valorPadrao: initialData.valorPadrao,
      diaVencimento: initialData.diaVencimento,
      ativo: initialData.ativo
    } : {
      valorPadrao: 0,
      diaVencimento: 1,
      ativo: true
    }
  });

  const watchedCategoria = watch('categoria');

  const handleFormSubmit = (data: ContaFixaFormData) => {
    onSubmit({
      titulo: data.titulo,
      categoria: data.categoria,
      valorPadrao: data.valorPadrao,
      diaVencimento: data.diaVencimento,
      ativo
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
          <Repeat className="h-5 w-5 text-primary" />
          {isEditing ? 'Editar Conta Fixa' : 'Nova Conta Fixa'}
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
                placeholder="Ex: Aluguel"
                className={errors.titulo ? 'border-destructive' : ''}
              />
              {errors.titulo && (
                <p className="text-sm text-destructive">{errors.titulo.message}</p>
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

            <div className="space-y-2">
              <Label htmlFor="valorPadrao">Valor Padrão</Label>
              <Input
                id="valorPadrao"
                type="number"
                step="0.01"
                {...register('valorPadrao', { valueAsNumber: true })}
                placeholder="0,00"
                className={errors.valorPadrao ? 'border-destructive' : ''}
              />
              {errors.valorPadrao && (
                <p className="text-sm text-destructive">{errors.valorPadrao.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diaVencimento">Dia do Vencimento</Label>
              <Input
                id="diaVencimento"
                type="number"
                min="1"
                max="31"
                {...register('diaVencimento', { valueAsNumber: true })}
                placeholder="1"
                className={errors.diaVencimento ? 'border-destructive' : ''}
              />
              {errors.diaVencimento && (
                <p className="text-sm text-destructive">{errors.diaVencimento.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ativo"
              checked={ativo}
              onCheckedChange={setAtivo}
            />
            <Label htmlFor="ativo" className="text-sm font-medium">
              Conta ativa (será incluída na geração mensal)
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar Conta Fixa')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContaFixaForm;