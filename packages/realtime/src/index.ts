import crypto from "node:crypto";
import { getEnv } from "@shiftslabs/config";

export interface RealtimeEventEnvelope<T = any> {
  id: string;
  type: string;
  version: number;
  businessId?: string;
  userId?: string;
  createdAt: string;
  payload: T;
}

export type RealtimeEventType =
  | "notification.created"
  | "appointment.created"
  | "appointment.updated"
  | "work_order.assigned"
  | "work_order.status_changed"
  | "sale.completed"
  | "order.created"
  | "order.status_changed"
  | "inventory.low_stock"
  | "invoice.created"
  | "payment.confirmed"
  | "subscription.updated"
  | "usage.threshold_reached"
  | "ai.insight.created"
  | "support.ticket.updated"
  | "advertisement.campaign_status_changed";

export function createRealtimeEvent<T>(
  type: RealtimeEventType,
  payload: T,
  options?: { businessId?: string; userId?: string }
): RealtimeEventEnvelope<T> {
  return {
    id: `evt_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    type,
    version: 1,
    businessId: options?.businessId,
    userId: options?.userId,
    createdAt: new Date().toISOString(),
    payload,
  };
}

// In-memory / subscriber hub
type Listener = (event: RealtimeEventEnvelope) => void;
const listeners: Set<Listener> = new Set();

export function subscribeRealtimeEvents(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function broadcastRealtimeEvent<T>(
  type: RealtimeEventType,
  payload: T,
  options?: { businessId?: string; userId?: string }
): RealtimeEventEnvelope<T> {
  const envelope = createRealtimeEvent(type, payload, options);
  for (const listener of listeners) {
    try {
      listener(envelope);
    } catch {
      // Ignore listener error
    }
  }
  return envelope;
}
