import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

/** Cliente del navegador; no importar para autenticar peticiones del servidor. */
export function getSupabase(): SupabaseClient {
  if (typeof window === 'undefined') {
    throw new Error('El cliente de autenticación requiere un navegador.');
  }
  if (client) return client;
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('El acceso todavía no está configurado. Intentá más tarde.');
  }
  client = createClient(url, key, {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      // El callback intercambia el código explícitamente una sola vez.
      detectSessionInUrl: false,
      storageKey: 'salon-client-auth',
    },
  });
  return client;
}

