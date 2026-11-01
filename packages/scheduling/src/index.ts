import { prisma, verifyBusinessMembership, scopeWhere } from "@shiftslabs/database";
import { assertCapability, BusinessRole } from "@shiftslabs/permissions";
import { AppointmentInput } from "@shiftslabs/validation";

export async function listAppointments(
  businessId: string,
  userId: string,
  range?: { startDate?: string; endDate?: string }
) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "scheduling:view");

  const where: any = { businessId };
  if (range?.startDate || range?.endDate) {
    where.startTime = {};
    if (range.startDate) where.startTime.gte = new Date(range.startDate);
    if (range.endDate) where.startTime.lte = new Date(range.endDate);
  }

  return prisma.appointment.findMany({
    where,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        },
      },
    },
    orderBy: { startTime: "asc" },
  });
}

export async function createAppointment(
  businessId: string,
  userId: string,
  input: AppointmentInput
) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "scheduling:manage");

  const startTime = new Date(input.startTime);
  const endTime = new Date(input.endTime);

  if (endTime <= startTime) {
    throw new Error("Appointment end time must be after start time.");
  }

  return prisma.appointment.create({
    data: {
      businessId,
      customerId: input.customerId || null,
      title: input.title,
      serviceName: input.serviceName || null,
      staffName: input.staffName || null,
      startTime,
      endTime,
      notes: input.notes || null,
      status: "confirmed",
    },
    include: {
      customer: true,
    },
  });
}

export async function updateAppointmentStatus(
  businessId: string,
  userId: string,
  appointmentId: string,
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show"
) {
  const { role } = await verifyBusinessMembership(userId, businessId);
  assertCapability(role as BusinessRole, "scheduling:manage");

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });
}
