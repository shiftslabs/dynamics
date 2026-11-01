export interface PlanDefinition {
  id: "free" | "starter" | "growth" | "pro";
  name: string;
  monthlyPriceCents: number;
  currency: string;
  logicalDbBytesLimit: number; // in bytes
  mediaStorageBytesLimit: number; // in bytes
  dailyAiMessagesLimit: number;
  adsEligible: boolean;
  gracePeriodDays: number;
  features: string[];
}

export const SHIFTSLABS_PLANS: Record<PlanDefinition["id"], PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    monthlyPriceCents: 0,
    currency: "USD",
    logicalDbBytesLimit: 50 * 1024 * 1024, // 50 MB
    mediaStorageBytesLimit: 500 * 1024 * 1024, // 500 MB
    dailyAiMessagesLimit: 20,
    adsEligible: true,
    gracePeriodDays: 7,
    features: [
      "Access to all 6 Shiftslabs applications",
      "50 MB Logical Database",
      "500 MB Media Storage",
      "20 AI Assistant queries / day",
      "Real-time sync & notifications"
    ]
  },
  starter: {
    id: "starter",
    name: "Starter",
    monthlyPriceCents: 299, // $2.99
    currency: "USD",
    logicalDbBytesLimit: 250 * 1024 * 1024, // 250 MB
    mediaStorageBytesLimit: 2 * 1024 * 1024 * 1024, // 2 GB
    dailyAiMessagesLimit: 100,
    adsEligible: false,
    gracePeriodDays: 7,
    features: [
      "Access to all 6 Shiftslabs applications",
      "250 MB Logical Database",
      "2 GB Media Storage",
      "100 AI Assistant queries / day",
      "Ad-free experience",
      "Priority notifications"
    ]
  },
  growth: {
    id: "growth",
    name: "Growth",
    monthlyPriceCents: 499, // $4.99
    currency: "USD",
    logicalDbBytesLimit: 1024 * 1024 * 1024, // 1 GB
    mediaStorageBytesLimit: 10 * 1024 * 1024 * 1024, // 10 GB
    dailyAiMessagesLimit: 300,
    adsEligible: false,
    gracePeriodDays: 7,
    features: [
      "Access to all 6 Shiftslabs applications",
      "1 GB Logical Database",
      "10 GB Media Storage",
      "300 AI Assistant queries / day",
      "Multi-branch operations",
      "Automated reports & insights"
    ]
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthlyPriceCents: 999, // $9.99
    currency: "USD",
    logicalDbBytesLimit: 5 * 1024 * 1024 * 1024, // 5 GB
    mediaStorageBytesLimit: 50 * 1024 * 1024 * 1024, // 50 GB
    dailyAiMessagesLimit: 1000,
    adsEligible: false,
    gracePeriodDays: 7,
    features: [
      "Access to all 6 Shiftslabs applications",
      "5 GB Logical Database",
      "50 GB Media Storage",
      "1,000 AI Assistant queries / day",
      "Advanced multi-location dispatch & POS",
      "Dedicated operational support"
    ]
  }
};

export interface TopUpProduct {
  id: string;
  name: string;
  type: "ai_messages" | "logical_db" | "media_storage";
  quantity: number;
  priceCents: number;
  currency: string;
  unitLabel: string;
}

export const TOP_UP_PRODUCTS: TopUpProduct[] = [
  {
    id: "topup_ai_500",
    name: "500 Extra AI Messages",
    type: "ai_messages",
    quantity: 500,
    priceCents: 199, // $1.99
    currency: "USD",
    unitLabel: "messages"
  },
  {
    id: "topup_db_500mb",
    name: "500 MB Database Storage",
    type: "logical_db",
    quantity: 500 * 1024 * 1024,
    priceCents: 149, // $1.49
    currency: "USD",
    unitLabel: "bytes"
  },
  {
    id: "topup_media_10gb",
    name: "10 GB Media Storage",
    type: "media_storage",
    quantity: 10 * 1024 * 1024 * 1024,
    priceCents: 249, // $2.49
    currency: "USD",
    unitLabel: "bytes"
  }
];

export interface AdPricingPlan {
  durationMonths: number;
  durationDays: number;
  priceCents: number;
  currency: string;
  name: string;
}

export const ADVERTISE_ME_PRICING: Record<number, AdPricingPlan> = {
  1: {
    durationMonths: 1,
    durationDays: 30,
    priceCents: 500, // $5.00
    currency: "USD",
    name: "1 Month Direct Placement"
  },
  2: {
    durationMonths: 2,
    durationDays: 60,
    priceCents: 1000, // $10.00
    currency: "USD",
    name: "2 Months Direct Placement"
  }
};
