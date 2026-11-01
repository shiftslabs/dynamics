import crypto from "node:crypto";
import { prisma, runInTransaction } from "@shiftslabs/database";
import { getEnv, SHIFTSLABS_PLANS, TOP_UP_PRODUCTS, PlanDefinition } from "@shiftslabs/config";

export function verifyPaystackSignature(rawBody: string, signatureHeader?: string): boolean {
  if (!signatureHeader) return false;
  const env = getEnv();
  const hash = crypto
    .createHmac("sha512", env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");
  return hash === signatureHeader;
}

export async function getUserSubscription(userId: string) {
  let sub = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!sub) {
    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + 30);

    sub = await prisma.subscription.create({
      data: {
        userId,
        planId: "free",
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: periodEnd,
      },
    });
  }

  const plan = (SHIFTSLABS_PLANS as any)[sub.planId] || SHIFTSLABS_PLANS.free;

  // Check grace period & ad-supported transitions
  const now = new Date();
  let effectiveStatus = sub.status;
  let adsEligible = plan.adsEligible;

  if (sub.status === "active" && now > sub.currentPeriodEnd && sub.planId !== "free") {
    // Check grace period
    const graceEnd = new Date(sub.currentPeriodEnd);
    graceEnd.setDate(graceEnd.getDate() + 7);

    if (now <= graceEnd) {
      effectiveStatus = "grace_period";
    } else {
      effectiveStatus = "ad_supported";
      adsEligible = true;
    }
  }

  return {
    ...sub,
    status: effectiveStatus,
    plan,
    adsEligible,
  };
}

export async function handlePaystackWebhook(eventPayload: {
  event: string;
  data: any;
}) {
  const { event, data } = eventPayload;

  if (event === "charge.success") {
    const reference = data.reference;
    // Check if it corresponds to an AdCampaign
    const adCampaign = await prisma.adCampaign.findUnique({
      where: { paystackRef: reference },
    });

    if (adCampaign && adCampaign.status === "pending_payment") {
      await prisma.adCampaign.update({
        where: { id: adCampaign.id },
        data: {
          status: "pending_review",
        },
      });
      return { handled: true, type: "ad_campaign", id: adCampaign.id };
    }

    // Check if it's a top-up
    const topUp = await prisma.topUpPurchase.findUnique({
      where: { paystackRef: reference },
    });

    if (topUp && topUp.status === "pending") {
      await prisma.topUpPurchase.update({
        where: { id: topUp.id },
        data: { status: "completed" },
      });
      return { handled: true, type: "top_up", id: topUp.id };
    }
  }

  return { handled: true, event };
}

export async function initiateTopUp(userId: string, topUpProductId: string) {
  const product = TOP_UP_PRODUCTS.find((p) => p.id === topUpProductId);
  if (!product) {
    throw new Error("Invalid top-up product.");
  }

  const paystackRef = `TOPUP-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

  const topUp = await prisma.topUpPurchase.create({
    data: {
      userId,
      topUpProductId: product.id,
      type: product.type,
      quantity: BigInt(product.quantity),
      priceCents: product.priceCents,
      status: "pending",
      paystackRef,
    },
  });

  return {
    topUpId: topUp.id,
    paystackRef,
    product,
  };
}
