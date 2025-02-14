import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jogykgijckiappwwefld.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZ3lrZ2lqY2tpYXBwd3dlZmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNzQ4MTgsImV4cCI6MjA0OTk1MDgxOH0.X-DdqQ8_jZuLy0mbc2wTHD9KrNLWM3GutQFxnE2QKqU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
