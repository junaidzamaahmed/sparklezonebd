import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  const variants = await db.productVariant.findMany({
    where: { productId },
  });
  return NextResponse.json(variants);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  const body = await request.json();
  const variant = await db.productVariant.create({
    data: {
      productId,
      sku: body.sku,
      price: parseFloat(body.price),
      stock: parseInt(body.stock),
      attributes: body.attributes,
    },
  });
  return NextResponse.json(variant);
}
