import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qkeoecfjhorqzykgcmyr.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrZW9lY2ZqaG9ycXp5a2djbXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMzA4MjksImV4cCI6MjA1ODkwNjgyOX0.FQlH1y7Bdoc8LnbM-XU1Dp5-cRvJliHOsnocfr0xPGs'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
