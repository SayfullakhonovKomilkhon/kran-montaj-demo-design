import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qkvgjrywutnudwcoekmf.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdmdqcnl3dXRudWR3Y29la21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDM2NTYsImV4cCI6MjA4NDMxOTY1Nn0.Ztu7mFeaaZq8Cp4NrKLtzc4C3MqU_f9uxd3ExGmlsvM',
    {
      cookies: {
        get(name) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name, value) {
          try {
            // Next.js cookies() doesn't support directly setting cookies in middleware
            // This is normally used by Supabase Auth and should work on the client
            cookieStore.set(name, value);
          } catch {
            // Ignore errors during static rendering or middleware
          }
        },
        remove(name) {
          try {
            cookieStore.delete(name);
          } catch {
            // Ignore errors during static rendering or middleware
          }
        },
      },
    }
  );
} 