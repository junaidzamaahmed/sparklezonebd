import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  const productAttributes = await db.productAttribute.findMany({
    where: { productId },
    include: { attribute: true },
  });
  return NextResponse.json(productAttributes);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  const body = await request.json();
  const productAttribute = await db.productAttribute.create({
    data: {
      productId,
      attributeId: body.attributeId,
      value: body.value,
    },
    include: { attribute: true },
  });
  return NextResponse.json(productAttribute);
}
