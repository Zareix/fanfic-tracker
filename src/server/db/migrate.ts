import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { Database } from "bun:sqlite";
import { writeFile } from "node:fs/promises";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { env } from "~/env";

if (!(await Bun.file(env.DATABASE_PATH).exists())) {
  console.log("Database file created");
  await writeFile(env.DATABASE_PATH, "");
}

console.log("Migrating database...");

const sqlite = new Database(env.DATABASE_PATH);
sqlite.exec("PRAGMA journal_mode = WAL;");
sqlite.exec("PRAGMA foreign_keys = OFF;");
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: "./drizzle" });
sqlite.exec("PRAGMA foreign_keys = ON;");

console.log("Database migrated");

db.$client.close();
