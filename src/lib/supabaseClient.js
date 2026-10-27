import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vtkhqhaagczyzckpglhn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable__qZFf0Z2_zIxUZt4Yh01Kw_orF2mym7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
