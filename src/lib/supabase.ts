import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Sorbo] Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no están configuradas. ' +
      'Crea un archivo .env.local basado en .env.example para conectar con Supabase.'
  );
}

/** Cliente de Supabase. Inicializa con valores de entorno o placeholders si no están definidos. */
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key'
);
