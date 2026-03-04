import "dotenv/config";
import fp from "fastify-plugin";
import { db } from "../db/index.js";

async function dbPlugin(fastify) {
  fastify.decorate("db", db);
}

export default fp(dbPlugin, { name: "db" });
