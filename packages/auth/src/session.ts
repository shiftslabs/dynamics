import crypto from "node:crypto";
import { prisma } from "@shiftslabs/database";
import { getEnv } from "@shiftslabs/config";

export const SESSION_COOKIE_NAME = "shiftslabs_session";
export const SESSION_MAX_AGE_DAYS = 30;

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  isPlatformAdmin: boolean;
}

export async function createSession(userId: string, userAgent?: string, ipAddress?: string) {
  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_MAX_AGE_DAYS);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      expiresAt,
    },
  });

  return { rawToken, expiresAt };
}

export async function validateSession(rawToken: string): Promise<SessionUser | null> {
  if (!rawToken) return null;
  const tokenHash = hashToken(rawToken);

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          isPlatformAdmin: true,
        },
      },
    },
  });

  if (!session) return null;

  if (new Date() > session.expiresAt) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return session.user;
}

export async function revokeSession(rawToken: string): Promise<void> {
  const tokenHash = hashToken(rawToken);
  await prisma.session.deleteMany({
    where: { tokenHash },
  });
}

export function getSessionCookieOptions() {
  const env = getEnv();
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
  };
}
