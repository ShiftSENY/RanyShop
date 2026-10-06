import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/health — deployment diagnostics. Reports whether required
// env vars are present and whether the database is reachable.
// Never exposes secret values.
export async function GET() {
  const env = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    DIRECT_URL: Boolean(process.env.DIRECT_URL),
    AUTH_SECRET: Boolean(
      process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
    ),
    NEXTAUTH_URL: Boolean(process.env.NEXTAUTH_URL),
  };

  let database: { ok: boolean; error?: string } = { ok: false };
  try {
    await db.$queryRaw`SELECT 1`;
    database = { ok: true };
  } catch (error) {
    console.error("Health check: database unreachable:", error);
    database = {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  const ok = database.ok && env.DATABASE_URL && env.AUTH_SECRET;

  return NextResponse.json({ ok, env, database }, { status: ok ? 200 : 503 });
}
