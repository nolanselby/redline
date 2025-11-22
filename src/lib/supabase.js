import { createClient } from '@supabase/supabase-js';

// Keys provided by user. In production, move these to .env.local
const supabaseUrl = 'https://gmllwklmsdirunfxehpy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtbGx3a2xtc2RpcnVuZnhlaHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDk3OTIsImV4cCI6MjA3OTMyNTc5Mn0.TDAfN27-qFmcYZ515FYTIvGE19Lz0kyNP3MRNCt_BSY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
