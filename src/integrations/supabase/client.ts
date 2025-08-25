// Create a single supabase client for the whole application
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => 
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )