import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const name = String(body.name || "").trim();
  if (!email || !password) return NextResponse.json({ error: { code: "INVALID_REQUEST", message: "Email and password required." } }, { status: 400 });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: { code: "CONFLICT", message: "Email already registered." } }, { status: 409 });
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  const user = await prisma.user.create({ data: { id: crypto.randomUUID(), email, name } });
  await prisma.credential.create({ data: { id: crypto.randomUUID(), userId: user.id, passwordHash: `${salt}:${hash}` } });
  return NextResponse.json({ data: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
}
