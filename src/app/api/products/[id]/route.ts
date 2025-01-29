import { db } from "@/utils/db";
import { ProductAttribute, ProductVariant } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      attributes: true,
      variants: true,
    },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body = await request.json();
  const product = await db.product.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      regularPrice: parseFloat(body.regularPrice),
      discountPrice: body.discountPrice ? parseFloat(body.discountPrice) : null,
      stock: parseInt(body.stock),
      categoryId: body.categoryId,
      brandId: body.brandId,
      attributes: {
        deleteMany: {},
        create: body.attributes.map((attr: Partial<ProductAttribute>) => ({
          name: attr.name,
          value: attr.value,
        })),
      },
      variants: {
        deleteMany: {},
        create: body.variants.map((variant: Partial<ProductVariant>) => ({
          sku: variant.sku,
          price: parseFloat(String(variant.price)),
          stock: parseInt(String(variant.stock)),
          attributes: variant.attributes,
        })),
      },
      images: body.images,
    },
    include: {
      category: true,
      brand: true,
      attributes: true,
      variants: true,
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  await db.product.delete({
    where: { id },
  });
  return NextResponse.json({ message: "Product deleted successfully" });
}
