import { prisma } from "@shiftslabs/database";
import { generateToken, hashToken } from "./session";

export async function createEmailVerificationToken(email: string) {
  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.emailVerificationToken.deleteMany({ where: { email } });
  await prisma.emailVerificationToken.create({
    data: {
      email,
      tokenHash,
      expiresAt,
    },
  });

  return rawToken;
}

export async function verifyEmailToken(rawToken: string): Promise<string | null> {
  const tokenHash = hashToken(rawToken);
  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
  });

  if (!record || new Date() > record.expiresAt) {
    return null;
  }

  await prisma.emailVerificationToken.delete({ where: { id: record.id } });
  return record.email;
}

export async function createPasswordResetToken(email: string) {
  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

  await prisma.passwordResetToken.deleteMany({ where: { email } });
  await prisma.passwordResetToken.create({
    data: {
      email,
      tokenHash,
      expiresAt,
    },
  });

  return rawToken;
}

export async function verifyPasswordResetToken(rawToken: string): Promise<string | null> {
  const tokenHash = hashToken(rawToken);
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!record || new Date() > record.expiresAt) {
    return null;
  }

  await prisma.passwordResetToken.delete({ where: { id: record.id } });
  return record.email;
}
