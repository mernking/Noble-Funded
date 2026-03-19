import fp from "fastify-plugin";
import { createClient } from "@supabase/supabase-js";

async function supabasePlugin(fastify) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    fastify.log.warn("Supabase credentials not configured. Auth will use local JWT only.");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  // Decorate fastify with supabase client
  fastify.decorate("supabase", supabase);

  fastify.log.info("Supabase client initialized successfully");
}

export default fp(supabasePlugin, {
  name: "supabase",
  dependencies: [],
});
