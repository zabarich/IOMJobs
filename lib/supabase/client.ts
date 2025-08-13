import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Debug log for production
if (typeof window === 'undefined') {
  console.log('🔧 Server-side Supabase init:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlStart: supabaseUrl?.substring(0, 30),
    keyStart: supabaseAnonKey?.substring(0, 20),
    keyLength: supabaseAnonKey?.length
  })
} else {
  console.log('🔧 Client-side Supabase init:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlStart: supabaseUrl?.substring(0, 30),
    keyStart: supabaseAnonKey?.substring(0, 20),
    keyLength: supabaseAnonKey?.length
  })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
    }
  }
})