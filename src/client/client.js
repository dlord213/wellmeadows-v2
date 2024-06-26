import { createClient } from "@supabase/supabase-js";

const serveSupabaseClient = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default serveSupabaseClient;
