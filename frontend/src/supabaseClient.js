import { createClient } from '@supabase/supabase-js';

// Read env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize client if env config is present, otherwise fallback to mock UI mode
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (supabase) {
  console.log("Supabase Auth initialized successfully from VITE_SUPABASE environment.");
} else {
  console.log("No Supabase configuration found. Defaulting to local interactive mock auth console.");
}
