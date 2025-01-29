import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productAttributes = await db.productAttribute.findMany({
    where: { productId: id },
  });
  return NextResponse.json(productAttributes);
}
