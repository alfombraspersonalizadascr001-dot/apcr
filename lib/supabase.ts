
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bxsaezeheqncnbrftlog.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable__85hv3cNMkjvGj9NnuJvyA_kLPL4hIK'

export const supabase = createClient(supabaseUrl, supabaseKey)
