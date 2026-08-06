// Supabase client with graceful fallback
// If env vars are missing, all operations silently return null
// and the app uses local state exclusively.

let supabase = null;

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (url && key && url !== 'your-supabase-url') {
  import('@supabase/supabase-js').then(({ createClient }) => {
    supabase = createClient(url, key);
  });
}

export const getSupabase = () => supabase;

export const safeQuery = async (fn) => {
  if (!supabase) return { data: null, error: null };
  try {
    return await fn(supabase);
  } catch (err) {
    console.warn('[TAP] Supabase query failed, using local fallback:', err.message);
    return { data: null, error: err };
  }
};

export default supabase;
