import "dotenv/config";
import Fastify from "fastify";
import AutoLoad from "@fastify/autoload";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

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

// Load plugins
fastify.register(AutoLoad, {
  dir: join(__dirname, "plugins"),
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
