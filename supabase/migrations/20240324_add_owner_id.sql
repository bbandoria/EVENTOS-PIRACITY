-- Verifica se a coluna owner_id existe na tabela venues
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'venues'
        AND column_name = 'owner_id'
    ) THEN
        ALTER TABLE public.venues
        ADD COLUMN owner_id uuid references auth.users(id);
    END IF;
END $$;

-- Verifica se a coluna owner_id existe na tabela events
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'events'
        AND column_name = 'owner_id'
    ) THEN
        ALTER TABLE public.events
        ADD COLUMN owner_id uuid references auth.users(id);
    END IF;
END $$;

-- Atualiza as políticas de segurança
DROP POLICY IF EXISTS "Venues are insertable by owner" ON public.venues;
DROP POLICY IF EXISTS "Venues are updatable by owner" ON public.venues;
DROP POLICY IF EXISTS "Venues are deletable by owner" ON public.venues;

CREATE POLICY "Venues are insertable by owner"
  ON public.venues FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Venues are updatable by owner"
  ON public.venues FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Venues are deletable by owner"
  ON public.venues FOR DELETE
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Events are insertable by owner" ON public.events;
DROP POLICY IF EXISTS "Events are updatable by owner" ON public.events;
DROP POLICY IF EXISTS "Events are deletable by owner" ON public.events;

CREATE POLICY "Events are insertable by owner"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Events are updatable by owner"
  ON public.events FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Events are deletable by owner"
  ON public.events FOR DELETE
  USING (auth.uid() = owner_id); 