import { prisma } from "@shiftslabs/database";

export async function createSupportTicket(input: {
  userId: string;
  businessId?: string;
  subject: string;
  message: string;
  priority?: "low" | "normal" | "high" | "urgent";
}) {
  return prisma.supportTicket.create({
    data: {
      userId: input.userId,
      businessId: input.businessId || null,
      subject: input.subject,
      message: input.message,
      priority: input.priority || "normal",
      status: "open",
    },
  });
}

export async function listUserSupportTickets(userId: string) {
  return prisma.supportTicket.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listAllSupportTickets(status?: string) {
  const where: any = {};
  if (status) where.status = status;
  return prisma.supportTicket.findMany({
    where,
    include: {
      user: { select: { id: true, email: true, name: true } },
      business: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
