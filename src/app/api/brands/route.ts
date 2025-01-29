import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const brands = await db.brand.findMany();
    return NextResponse.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const brand = await db.brand.create({
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
      },
    });
    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
