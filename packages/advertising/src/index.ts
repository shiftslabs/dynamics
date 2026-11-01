import crypto from "node:crypto";
import { prisma } from "@shiftslabs/database";
import { ADVERTISE_ME_PRICING } from "@shiftslabs/config";
import { AdCampaignInput } from "@shiftslabs/validation";

export async function createAdCampaign(userId: string, input: AdCampaignInput) {
  const pricing = ADVERTISE_ME_PRICING[input.durationMonths];
  if (!pricing) {
    throw new Error("Invalid campaign duration.");
  }

  const paystackRef = `AD-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

  const campaign = await prisma.adCampaign.create({
    data: {
      advertiserId: userId,
      businessName: input.businessName,
      contactEmail: input.contactEmail,
      headline: input.headline,
      description: input.description,
      ctaType: input.ctaType,
      ctaUrl: input.ctaUrl,
      mediaUrl: input.mediaUrl,
      mediaType: input.mediaType,
      durationMonths: input.durationMonths,
      priceCents: pricing.priceCents,
      status: "pending_payment",
      paystackRef,
    },
  });

  return {
    campaign,
    paystackRef,
    priceCents: pricing.priceCents,
    currency: pricing.currency,
  };
}

export async function listUserCampaigns(userId: string) {
  return prisma.adCampaign.findMany({
    where: { advertiserId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listAdminCampaigns(status?: string) {
  const where: any = {};
  if (status) {
    where.status = status;
  }
  return prisma.adCampaign.findMany({
    where,
    include: { advertiser: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function reviewCampaign(
  campaignId: string,
  decision: "approved" | "rejected",
  reason?: string
) {
  const campaign = await prisma.adCampaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) {
    throw new Error("Campaign not found.");
  }

  const now = new Date();
  let endsAt: Date | null = null;
  if (decision === "approved") {
    const days = campaign.durationMonths === 2 ? 60 : 30;
    endsAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  }

  return prisma.adCampaign.update({
    where: { id: campaignId },
    data: {
      status: decision === "approved" ? "active" : "rejected",
      rejectReason: reason || null,
      startsAt: decision === "approved" ? now : null,
      endsAt,
    },
  });
}

export async function recordImpression(campaignId: string) {
  return prisma.adCampaign.update({
    where: { id: campaignId },
    data: { impressions: { increment: 1 } },
  });
}

export async function recordClick(campaignId: string) {
  return prisma.adCampaign.update({
    where: { id: campaignId },
    data: { clicks: { increment: 1 } },
  });
}

export async function getActiveAdForPlacement() {
  const now = new Date();
  return prisma.adCampaign.findFirst({
    where: {
      status: "active",
      startsAt: { lte: now },
      endsAt: { gte: now },
    },
    orderBy: { impressions: "asc" },
  });
}
