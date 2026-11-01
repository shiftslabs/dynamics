import { prisma } from "@shiftslabs/database";
import { getEnv, SHIFTSLABS_PLANS } from "@shiftslabs/config";
import { incrementAiUsage } from "@shiftslabs/metering";

export async function askBusinessAssistant(input: {
  userId: string;
  businessId: string;
  conversationId?: string;
  userMessage: string;
}): Promise<{ message: string; conversationId: string }> {
  const env = getEnv();

  // Check quota
  const sub = await prisma.subscription.findUnique({
    where: { userId: input.userId },
  });
  const plan = (SHIFTSLABS_PLANS as any)[sub?.planId || "free"] || SHIFTSLABS_PLANS.free;
  const hasQuota = await incrementAiUsage(input.businessId, plan.dailyAiMessagesLimit);

  if (!hasQuota) {
    throw new Error(
      `Daily AI assistant message limit reached (${plan.dailyAiMessagesLimit} messages/day). You can upgrade your plan or purchase a top-up to continue immediately.`
    );
  }

  // Get or create conversation
  let conversationId = input.conversationId;
  if (!conversationId) {
    const convo = await prisma.aiConversation.create({
      data: {
        userId: input.userId,
        title: input.userMessage.slice(0, 40) + "...",
      },
    });
    conversationId = convo.id;
  }

  // Store user message
  await prisma.aIMessage.create({
    data: {
      conversationId,
      role: "user",
      content: input.userMessage,
    },
  });

  // Pull scoped business context
  const [biz, sales, lowStock, openInvoices] = await Promise.all([
    prisma.business.findUnique({
      where: { id: input.businessId },
      select: { name: true, currency: true, defaultApp: true, professionId: true },
    }),
    prisma.sale.aggregate({
      where: { businessId: input.businessId, status: "completed" },
      _sum: { totalCents: true },
      _count: true,
    }),
    prisma.stockItem.findMany({
      where: { businessId: input.businessId },
      include: { product: true },
      take: 5,
    }),
    prisma.invoice.findMany({
      where: { businessId: input.businessId, status: { in: ["sent", "partial", "overdue"] } },
      select: { invoiceNumber: true, totalCents: true, paidAmountCents: true },
      take: 5,
    }),
  ]);

  const outstandingTotalCents = openInvoices.reduce(
    (acc, inv) => acc + (inv.totalCents - inv.paidAmountCents),
    0
  );

  let assistantReply = "";

  // Call real provider adapter if key exists, otherwise provide structured business insights
  if (env.AI_API_KEY && !env.AI_API_KEY.includes("test")) {
    try {
      const prompt = `You are the executive Shiftslabs Business OS AI copilot for ${biz?.name} (${biz?.professionId} on ${biz?.defaultApp}).
Business Currency: ${biz?.currency}
Total Completed Sales: ${sales._count} (Gross: $${((sales._sum.totalCents || 0) / 100).toFixed(2)})
Outstanding Unpaid Invoices: ${openInvoices.length} ($${(outstandingTotalCents / 100).toFixed(2)})
User Inquiry: ${input.userMessage}
Provide a concise, practical, actionable response tailored to this business.`;

      const response = await fetch(
        `${env.AI_BASE_URL}/v1beta/models/${env.AI_MODEL}:generateContent?key=${env.AI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        assistantReply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Here is an update on your business operations.";
      }
    } catch {
      // Fallback to deterministic executive response
    }
  }

  if (!assistantReply) {
    assistantReply = `Regarding "${input.userMessage}": For ${biz?.name || "your business"}, you currently have ${sales._count} completed sales ($${((sales._sum.totalCents || 0) / 100).toFixed(2)}), with ${openInvoices.length} open invoices totaling $${(outstandingTotalCents / 100).toFixed(2)} awaiting payment. Let me know if you would like me to prepare reminders, check inventory, or draft customer follow-ups.`;
  }

  // Save assistant message
  await prisma.aIMessage.create({
    data: {
      conversationId,
      role: "assistant",
      content: assistantReply,
    },
  });

  return {
    message: assistantReply,
    conversationId,
  };
}

export async function runProactiveIntelligenceJob(businessId: string) {
  // Deterministic checks
  const openInvoices = await prisma.invoice.findMany({
    where: {
      businessId,
      status: { in: ["sent", "partial", "overdue"] },
      dueDate: { lt: new Date() },
    },
  });

  if (openInvoices.length > 0) {
    const totalOverdueCents = openInvoices.reduce(
      (acc, inv) => acc + (inv.totalCents - inv.paidAmountCents),
      0
    );

    // Check if insight already generated today
    const existing = await prisma.aIInsight.findFirst({
      where: {
        businessId,
        type: "unpaid_invoices",
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    if (!existing) {
      await prisma.aIInsight.create({
        data: {
          businessId,
          type: "unpaid_invoices",
          title: `${openInvoices.length} Overdue Invoices Requiring Follow-up`,
          summary: `You have ${openInvoices.length} overdue customer invoices with an outstanding balance of $${(totalOverdueCents / 100).toFixed(2)}.`,
          evidence: JSON.stringify({ count: openInvoices.length, totalOverdueCents }),
          actionable: true,
        },
      });
    }
  }

  // Scan for stale drafts for suggested cleanup
  const staleDraftInvoices = await prisma.invoice.findMany({
    where: {
      businessId,
      status: "draft",
      createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // older than 30 days
    },
    take: 5,
  });

  for (const draft of staleDraftInvoices) {
    const existingSuggestion = await prisma.aICleanupSuggestion.findFirst({
      where: { businessId, itemId: draft.id },
    });
    if (!existingSuggestion) {
      await prisma.aICleanupSuggestion.create({
        data: {
          businessId,
          itemType: "stale_draft_invoice",
          itemId: draft.id,
          title: `Draft Invoice #${draft.invoiceNumber} (${draft.subtotalCents > 0 ? "$" + (draft.subtotalCents / 100).toFixed(2) : "Empty"})`,
          explanation: "This draft invoice was created over 30 days ago and has not been sent or modified.",
          status: "pending",
        },
      });
    }
  }
}
