import { db } from "@/utils/db";
import { ProductAttribute } from "@prisma/client";
import { ProductVariant } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await db.product.findMany({
      include: {
        category: true,
        brand: true,
        attributes: true,
        variants: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const product = await db.product.create({
      data: {
        name: body.name,
        description: body.description,
        regularPrice: parseFloat(body.regularPrice),
        discountPrice: body.discountPrice
          ? parseFloat(body.discountPrice)
          : null,
        stock: parseInt(body.stock),
        categoryId: body.categoryId,
        brandId: body.brandId,
        attributes: {
          create: body.attributes.map((attr: Partial<ProductAttribute>) => ({
            name: attr.name,
            value: attr.value,
          })),
        },
        variants: {
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
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
