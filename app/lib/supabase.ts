import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qkvgjrywutnudwcoekmf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdmdqcnl3dXRudWR3Y29la21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDM2NTYsImV4cCI6MjA4NDMxOTY1Nn0.Ztu7mFeaaZq8Cp4NrKLtzc4C3MqU_f9uxd3ExGmlsvM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 