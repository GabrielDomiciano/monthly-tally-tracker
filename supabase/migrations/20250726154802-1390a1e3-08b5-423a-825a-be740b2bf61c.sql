-- Create tables for the financial control app

-- Table for regular accounts (contas)
CREATE TABLE public.contas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data DATE NOT NULL,
  categoria TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pago', 'pendente')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for fixed accounts (contas fixas)
CREATE TABLE public.contas_fixas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  valor_padrao DECIMAL(10,2) NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento >= 1 AND dia_vencimento <= 31),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for monthly generation records
CREATE TABLE public.geracoes_mensais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conta_fixa_id UUID NOT NULL REFERENCES public.contas_fixas(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  mes TEXT NOT NULL, -- formato YYYY-MM
  ja_gerada BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(conta_fixa_id, mes)
);

-- Enable Row Level Security
ALTER TABLE public.contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_fixas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geracoes_mensais ENABLE ROW LEVEL SECURITY;

-- Since there's no authentication yet, allow all operations for now
-- These policies should be updated when authentication is implemented
CREATE POLICY "Allow all operations on contas" ON public.contas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on contas_fixas" ON public.contas_fixas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on geracoes_mensais" ON public.geracoes_mensais FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_contas_updated_at
  BEFORE UPDATE ON public.contas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contas_fixas_updated_at
  BEFORE UPDATE ON public.contas_fixas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_contas_data ON public.contas(data);
CREATE INDEX idx_contas_categoria ON public.contas(categoria);
CREATE INDEX idx_contas_status ON public.contas(status);
CREATE INDEX idx_contas_fixas_ativo ON public.contas_fixas(ativo);
CREATE INDEX idx_geracoes_mensais_mes ON public.geracoes_mensais(mes);