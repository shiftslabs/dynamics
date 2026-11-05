import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET() {
  let business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } }); if (!business) { let owner = await prisma.user.findFirst(); if (!owner) owner = await prisma.user.create({ data: { id: "system", email: "system@local", name: "System" } }); business = await prisma.business.create({ data: { ownerId: owner.id, name: "My Business", slug: "my-business-" + Date.now(), defaultApp: "craftkoru" } }); }
  const businessId = business.id;
  const appointments = await prisma.appointment.findMany({ where: { businessId }, orderBy: { startTime: "asc" } });
  return NextResponse.json({ data: appointments });
}

export async function POST(req: Request) {
  const body = await req.json();
  let business = await prisma.business.findFirst({ where: { defaultApp: "craftkoru" } }); if (!business) { let owner = await prisma.user.findFirst(); if (!owner) owner = await prisma.user.create({ data: { id: "system", email: "system@local", name: "System" } }); business = await prisma.business.create({ data: { ownerId: owner.id, name: "My Business", slug: "my-business-" + Date.now(), defaultApp: "craftkoru" } }); }
  const businessId = business.id;
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

