import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET(_req: Request, { params }: { params: { customerId: string } }) {
  const customer = await prisma.customer.findUnique({ where: { id: params.customerId } });
  if (!customer) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Customer not found." } }, { status: 404 });
  return NextResponse.json({ data: customer });
}

export async function PATCH(req: Request, { params }: { params: { customerId: string } }) {
  const body = await req.json();
  const customer = await prisma.customer.update({ where: { id: params.customerId }, data: body });
  return NextResponse.json({ data: customer });
}

export async function DELETE(_req: Request, { params }: { params: { customerId: string } }) {
  await prisma.customer.delete({ where: { id: params.customerId } });
  return new NextResponse(null, { status: 204 });
}
