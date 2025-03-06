import { defineConfig } from "drizzle-kit";
import "better-sqlite3";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/server/db/schema.ts",
  dbCredentials: {
    url: "sqlite.db",
  },
});
