import { supabase } from '../lib/supabaseClient';

/**
 * Fetch approved reviews live from Supabase PostgreSQL database
 * ZERO hardcoded reviews: completely data-driven from public.reviews
 */
export async function fetchReviewsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      return data;
    }
  } catch (err) {
    console.warn('Supabase reviews query warning:', err);
  }

  // REST API fallback
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vtkhqhaagczyzckpglhn.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable__qZFf0Z2_zIxUZt4Yh01Kw_orF2mym7';
    const res = await fetch(`${supabaseUrl}/rest/v1/reviews?approved=eq.true&order=created_at.desc`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (_) {}

  return [];
}
