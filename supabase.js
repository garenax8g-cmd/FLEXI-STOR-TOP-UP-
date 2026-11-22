// Connexion à Supabase

const SUPABASE_URL = "https://kpfqandyvsrszgdfpnug.supabase.co/rest/v1/";

const SUPABASE_KEY = "sb_publishable_v9hK_MgfRrBHX-apuR3LVA_eJmdl5G5";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
