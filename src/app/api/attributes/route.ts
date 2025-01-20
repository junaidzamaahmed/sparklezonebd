import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  const attributes = await db.attribute.findMany();
  return NextResponse.json(attributes);
}

export async function POST(request: Request) {
  const body = await request.json();
  const attribute = await db.attribute.create({
    data: {
      name: body.name,
    },
  });
  return NextResponse.json(attribute);
}
