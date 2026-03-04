// Routes root — fastify autoload will crawl subdirectories
// Each directory under routes/ is auto-loaded

export default async function root(fastify) {
  fastify.get("/", async () => ({
    name: "Noble Funded API",
    version: "1.0.0",
    status: "running",
  }));

  fastify.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }));
}
