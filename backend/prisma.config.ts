/// <reference types="node" />
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node dist/db/seed.js",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
