import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const user = await prisma.user.findUnique({ where: { email }, include: { credentials: true } });
  if (!user || !user.credentials.length) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Invalid credentials." } }, { status: 401 });
  const cred = user.credentials[0];
  const [salt, hash] = cred.passwordHash.split(":");
  const computed = crypto.scryptSync(password, salt, 64).toString("hex");
  if (computed !== hash) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Invalid credentials." } }, { status: 401 });
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  await prisma.session.create({ data: { id: crypto.randomUUID(), userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });
  const res = NextResponse.json({ data: { id: user.id, email: user.email, name: user.name } });
  res.cookies.set("session", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 7 * 24 * 60 * 60 });
  return res;
}
