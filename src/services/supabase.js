import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://tqwmhoyjyhcitlptmdfc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxd21ob3lqeWhjaXRscHRtZGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMzk3MjYsImV4cCI6MjA1NTcxNTcyNn0.PDG2rVq6TDZ9YZVEV-YDHL2e_lSBZPly3xAlUfCaNi0";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
