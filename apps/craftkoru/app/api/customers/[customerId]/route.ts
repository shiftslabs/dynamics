import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET(_req: Request, { params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Customer not found." } }, { status: 404 });
  return NextResponse.json({ data: customer });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  const body = await req.json();
  const customer = await prisma.customer.update({ where: { id: customerId }, data: body });
  return NextResponse.json({ data: customer });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  await prisma.customer.delete({ where: { id: customerId } });
  return new NextResponse(null, { status: 204 });
}
