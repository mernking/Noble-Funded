"use strict";
import "dotenv/config";

const options = {};

export default async function app(fastify, opts) {
  // Register plugins
  fastify.register(import("@fastify/autoload"), {
    dir: new URL("./plugins", import.meta.url).pathname,
    options: Object.assign({}, opts),
  });

  // Register routes
  fastify.register(import("@fastify/autoload"), {
    dir: new URL("./routes", import.meta.url).pathname,
    options: Object.assign({}, opts),
  });
}

export { options };
