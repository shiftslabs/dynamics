import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";
import crypto from "crypto";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(/session=([^;]+)/);
  if (!m) return NextResponse.json({ data: null });
  const tokenHash = crypto.createHash("sha256").update(m[1]).digest("hex");
  const session = await prisma.session.findUnique({ where: { tokenHash }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) return NextResponse.json({ data: null });
  return NextResponse.json({ data: { id: session.user.id, email: session.user.email, name: session.user.name } });
}
