import { prisma } from "./client";
import { getEnv } from "@shiftslabs/config";

async function main() {
  const env = getEnv();
  if (env.NODE_ENV === "production") {
    console.warn("Safety check: Automatic database seeding is strictly prohibited in production.");
    return;
  }

  console.log("Starting development database seed...");

  // Create demo user if not exists
  const demoEmail = "founder@shiftslabs.com";
  let user = await prisma.user.findUnique({ where: { email: demoEmail } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: demoEmail,
        name: "Godknows Tochi Okereke",
        isEmailVerified: true,
        isPlatformAdmin: true,
        profile: {
          create: {
            timezone: "Africa/Lagos",
            locale: "en",
          },
        },
      },
    });
    console.log(`Created primary user: ${user.email}`);
  }

  // Create representative businesses for testing vertical flows if none exists
  const existingBiz = await prisma.business.findFirst({ where: { ownerId: user.id } });
  if (!existingBiz) {
    const biz = await prisma.business.create({
      data: {
        name: "Shiftslabs Atelier & Tailoring",
        slug: "shiftslabs-atelier",
        ownerId: user.id,
        defaultApp: "craftkoru",
        professionId: "tailor",
        currency: "USD",
        timezone: "Africa/Lagos",
        memberships: {
          create: {
            userId: user.id,
            role: "owner",
          },
        },
        settings: {
          create: {
            taxRatePercent: 7.5,
          },
        },
        usageAccount: {
          create: {},
        },
      },
    });
    console.log(`Created primary test business: ${biz.name} (${biz.slug})`);
  }

  console.log("Development database seed completed successfully.");
}

if (require.main === module) {
  main()
    .catch((err) => {
      console.error("Database seed failed:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { main as seedDatabase };
