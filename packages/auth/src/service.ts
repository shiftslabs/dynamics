import { prisma } from "@shiftslabs/database";
import { hashPassword, verifyPassword } from "./password";
import { createSession, revokeSession } from "./session";
import { createEmailVerificationToken, verifyEmailToken, createPasswordResetToken, verifyPasswordResetToken } from "./tokens";

export class AuthenticationError extends Error {
  constructor(message = "Authentication failed.") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export async function registerUser(input: {
  email: string;
  password: string;
  name?: string;
  userAgent?: string;
  ipAddress?: string;
}) {
  const normalizedEmail = input.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw new AuthenticationError("An account with this email address already exists.");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: input.name || null,
      credentials: {
        create: {
          passwordHash,
        },
      },
      profile: {
        create: {},
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      isEmailVerified: true,
      isPlatformAdmin: true,
    },
  });

  const verificationToken = await createEmailVerificationToken(normalizedEmail);
  const session = await createSession(user.id, input.userAgent, input.ipAddress);

  return {
    user,
    session,
    verificationToken,
  };
}

export async function loginUser(input: {
  email: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
}) {
  const normalizedEmail = input.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      credentials: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!user || user.credentials.length === 0) {
    await prisma.loginAttempt.create({
      data: {
        email: normalizedEmail,
        success: false,
        ipAddress: input.ipAddress || null,
      },
    });
    throw new AuthenticationError("Invalid email or password.");
  }

  const isValid = await verifyPassword(input.password, user.credentials[0].passwordHash);

  if (!isValid) {
    await prisma.loginAttempt.create({
      data: {
        userId: user.id,
        email: normalizedEmail,
        success: false,
        ipAddress: input.ipAddress || null,
      },
    });
    throw new AuthenticationError("Invalid email or password.");
  }

  await prisma.loginAttempt.create({
    data: {
      userId: user.id,
      email: normalizedEmail,
      success: true,
      ipAddress: input.ipAddress || null,
    },
  });

  const session = await createSession(user.id, input.userAgent, input.ipAddress);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isEmailVerified: user.isEmailVerified,
      isPlatformAdmin: user.isPlatformAdmin,
    },
    session,
  };
}

export async function confirmEmailVerification(token: string) {
  const email = await verifyEmailToken(token);
  if (!email) {
    throw new AuthenticationError("Verification link is invalid or expired.");
  }

  await prisma.user.update({
    where: { email },
    data: { isEmailVerified: true },
  });

  return { email };
}

export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  
  if (user) {
    return createPasswordResetToken(normalizedEmail);
  }
  return null;
}

export async function executePasswordReset(token: string, newPassword: string) {
  const email = await verifyPasswordResetToken(token);
  if (!email) {
    throw new AuthenticationError("Password reset link is invalid or expired.");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AuthenticationError("User not found.");
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.credential.create({
    data: {
      userId: user.id,
      passwordHash,
    },
  });

  // Invalidate all active sessions for security
  await prisma.session.deleteMany({ where: { userId: user.id } });

  return { success: true };
}
