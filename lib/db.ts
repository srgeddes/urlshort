import { PrismaClient } from "@/app/generated/prisma/client";
import path from "node:path";
import { pathToFileURL } from "node:url";

function ensureDatabaseUrl() {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim()) {
    return;
  }

  const devDbPath = path.join(process.cwd(), "prisma", "dev.db");
  process.env.DATABASE_URL = pathToFileURL(devDbPath).toString();
}

ensureDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

