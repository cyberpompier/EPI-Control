import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://quvdxjxszquqqcvesntn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmR4anhzenF1cXFjdmVzbnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTk3MTQsImV4cCI6MjA1NTYzNTcxNH0.MB_f2XGYYNwV0CSIjz4W7_KoyNNTkeFMfJZee-N2vKw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Also export the createClient function
export const createClient = () => createSupabaseClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);