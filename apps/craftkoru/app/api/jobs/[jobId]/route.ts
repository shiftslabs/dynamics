import { NextResponse } from "next/server";
import { prisma } from "@shiftslabs/database";

export async function GET(_req: Request, { params }: { params: { jobId: string } }) {
  const job = await prisma.workOrder.findUnique({ where: { id: params.jobId }, include: { customer: true } });
  if (!job) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Job not found." } }, { status: 404 });
  return NextResponse.json({ data: job });
}

export async function PATCH(req: Request, { params }: { params: { jobId: string } }) {
  const body = await req.json();
  const job = await prisma.workOrder.update({
    where: { id: params.jobId },
    data: {
      title: body.title,
      status: body.status,
      priceChargedCents: body.priceChargedCents,
      laborCostCents: body.laborCostCents,
      materialCostCents: body.materialCostCents,
      additionalCostCents: body.additionalCostCents,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      notes: body.notes,
    },
  });
  return NextResponse.json({ data: job });
}

export async function DELETE(_req: Request, { params }: { params: { jobId: string } }) {
  await prisma.workOrder.delete({ where: { id: params.jobId } });
  return new NextResponse(null, { status: 204 });
}
