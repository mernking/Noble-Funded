import "dotenv/config";
import { defineConfig } from "drizzle-kit";

function isProduction() {
  console.log("NODE_ENV:", process.env.DATABASE_URL);
  return process.env.NODE_ENV === "production";
}

export default defineConfig({
  schema: "./db/schema.js",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    ssl: isProduction() ? true : false,
    url: process.env.DATABASE_URL,
  },
});
