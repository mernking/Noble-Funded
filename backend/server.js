import "module-alias/register";
import "dotenv/config";
import Fastify from "fastify";
import AutoLoad from "@fastify/autoload";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import supabasePlugin from "./plugins/supabase.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
    transport:
      process.env.NODE_ENV !== "production"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
  },
});

// Register Supabase first (before other plugins that depend on it)
await fastify.register(supabasePlugin);

// Load other plugins via AutoLoad
fastify.register(AutoLoad, {
  dir: join(__dirname, "plugins"),
  ignorePattern: /supabase\.js$/,
  forceESM: true,
});

// Load routes
fastify.register(AutoLoad, {
  dir: join(__dirname, "routes"),
  forceESM: true,
  routeParams: true,
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || "0.0.0.0";
    await fastify.listen({ port, host });
    console.log(`🚀 Noble Funded API running at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
