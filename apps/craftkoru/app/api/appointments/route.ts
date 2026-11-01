import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET() {
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const appointments = await prisma.appointment.findMany({ where: { businessId }, orderBy: { startTime: "asc" } });
  return NextResponse.json({ data: appointments });
}

export async function POST(req: Request) {
  const body = await req.json();
  const business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } });
  const businessId = business?.id || "default";
  const appointment = await prisma.appointment.create({
    data: {
      businessId,
      title: body.title,
      startTime: new Date(body.startTime),
      endTime: body.endTime ? new Date(body.endTime) : new Date(new Date(body.startTime).getTime() + 60 * 60 * 1000),
      status: "scheduled",
      staffName: body.staffName || null,
    },
  });
  return NextResponse.json({ data: appointment }, { status: 201 });
}
