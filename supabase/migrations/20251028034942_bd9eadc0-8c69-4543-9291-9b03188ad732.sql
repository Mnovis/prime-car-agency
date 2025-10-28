-- Criar tabela de veículos
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  km INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  brand VARCHAR(50) NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela de veículos
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: todos podem visualizar veículos
CREATE POLICY "Anyone can view vehicles"
ON public.vehicles
FOR SELECT
USING (true);

-- Políticas RLS: apenas admins autenticados podem inserir
CREATE POLICY "Authenticated users can insert vehicles"
ON public.vehicles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Políticas RLS: apenas admins autenticados podem atualizar
CREATE POLICY "Authenticated users can update vehicles"
ON public.vehicles
FOR UPDATE
TO authenticated
USING (true);

-- Políticas RLS: apenas admins autenticados podem deletar
CREATE POLICY "Authenticated users can delete vehicles"
ON public.vehicles
FOR DELETE
TO authenticated
USING (true);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar bucket de storage para imagens dos carros
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage: todos podem visualizar
CREATE POLICY "Anyone can view vehicle images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'vehicle-images');

-- Políticas de storage: usuários autenticados podem fazer upload
CREATE POLICY "Authenticated users can upload vehicle images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehicle-images');

-- Políticas de storage: usuários autenticados podem atualizar
CREATE POLICY "Authenticated users can update vehicle images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'vehicle-images');

-- Políticas de storage: usuários autenticados podem deletar
CREATE POLICY "Authenticated users can delete vehicle images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'vehicle-images');

-- Criar tabela de contatos
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela de contatos
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: qualquer um pode inserir contato
CREATE POLICY "Anyone can insert contacts"
ON public.contacts
FOR INSERT
WITH CHECK (true);

-- Políticas RLS: apenas usuários autenticados podem visualizar contatos
CREATE POLICY "Authenticated users can view contacts"
ON public.contacts
FOR SELECT
TO authenticated
USING (true);