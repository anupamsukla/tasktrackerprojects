import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// These values are set when the user connects to Supabase
// and are stored in .env file after connecting
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);