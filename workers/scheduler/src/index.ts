import { prisma } from "@shiftslabs/database";
import { runProactiveIntelligenceJob } from "@shiftslabs/intelligence";
import { createStructuredLogger } from "@shiftslabs/observability";

const logger = createStructuredLogger("worker:scheduler");

export async function executeSchedulerTick() {
  logger.info("Executing periodic 30-minute scheduler tick...");

  try {
    // 1. Process active businesses for proactive intelligence
    const businesses = await prisma.business.findMany({
      select: { id: true, name: true },
      take: 50,
    });

    for (const biz of businesses) {
      try {
        await runProactiveIntelligenceJob(biz.id);
      } catch (err: any) {
        logger.error(`Error executing intelligence job for business ${biz.id}: ${err.message}`);
      }
    }

    // 2. Check and expire completed AdvertiseMe campaigns
    const now = new Date();
    const expiredCampaigns = await prisma.adCampaign.findMany({
      where: {
        status: "active",
        endsAt: { lte: now },
      },
    });

    for (const campaign of expiredCampaigns) {
      await prisma.adCampaign.update({
        where: { id: campaign.id },
        data: { status: "expired" },
      });
      logger.info(`Campaign #${campaign.id} expired.`);
    }

    // 3. Process subscription grace period transitions
    const expiredSubs = await prisma.subscription.findMany({
      where: {
        status: "active",
        planId: { not: "free" },
        currentPeriodEnd: { lt: now },
      },
    });

    for (const sub of expiredSubs) {
      const graceEnd = new Date(sub.currentPeriodEnd);
      graceEnd.setDate(graceEnd.getDate() + 7);

      if (now > graceEnd) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: "ad_supported" },
        });
        logger.info(`Subscription #${sub.id} transitioned to ad_supported.`);
      } else {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: "grace_period" },
        });
        logger.info(`Subscription #${sub.id} transitioned to grace_period.`);
      }
    }

    logger.info("Scheduler tick completed successfully.");
  } catch (err: any) {
    logger.error(`Scheduler tick failed: ${err.message}`);
  }
}

// If executed directly, run in a 30-minute interval loop
if (require.main === module) {
  logger.info("Scheduler background worker started.");
  executeSchedulerTick();
  setInterval(executeSchedulerTick, 30 * 60 * 1000);
}
