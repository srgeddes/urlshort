import { PrismaClient } from "@/app/generated/prisma/client";
import path from "node:path";
import { pathToFileURL } from "node:url";

function ensureDatabaseUrl() {
  let databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    const devDbPath = path.join(process.cwd(), "prisma", "dev.db");
    databaseUrl = pathToFileURL(devDbPath).toString();
  }

  if (databaseUrl.startsWith("file:")) {
    const filePath = databaseUrl.slice("file:".length);
    const hasHost = filePath.startsWith("//");
    const isAbsolutePath = hasHost || path.isAbsolute(filePath);

    if (!isAbsolutePath) {
      const resolvedPath = path.resolve(process.cwd(), filePath);
      databaseUrl = pathToFileURL(resolvedPath).toString();
    }
  }

  process.env.DATABASE_URL = databaseUrl;
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

