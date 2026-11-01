import { prisma } from "@shiftslabs/database";
import { getEnv } from "@shiftslabs/config";

export interface SendNotificationInput {
  businessId: string;
  userId?: string;
  category: "reminder" | "booking" | "order" | "inventory" | "payment" | "system" | "ai";
  title: string;
  message: string;
  linkUrl?: string;
  sendEmail?: boolean;
  emailRecipient?: string;
}

export async function createNotification(input: SendNotificationInput) {
  const notification = await prisma.notification.create({
    data: {
      businessId: input.businessId,
      userId: input.userId || null,
      category: input.category,
      title: input.title,
      message: input.message,
      linkUrl: input.linkUrl || null,
    },
  });

  if (input.sendEmail && input.emailRecipient) {
    await sendTransactionalEmail({
      to: input.emailRecipient,
      subject: input.title,
      text: input.message,
    }).catch(() => {});
  }

  return notification;
}

export async function listNotifications(businessId: string, limit = 50) {
  return prisma.notification.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function markNotificationAsRead(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllNotificationsAsRead(businessId: string) {
  return prisma.notification.updateMany({
    where: { businessId, isRead: false },
    data: { isRead: true },
  });
}

export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const env = getEnv();
  // Using Resend API endpoint
  if (!env.RESEND_API_KEY || env.RESEND_API_KEY.includes("mock") || env.RESEND_API_KEY.includes("test")) {
    return { success: true, simulated: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html || `<p>${input.text}</p>`,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Email delivery failed: ${errorText}`);
  }

  return res.json();
}
