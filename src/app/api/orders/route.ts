import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, ...orderData } = body;

    const user = await db.user.findUnique({
      where: {
        clerkId: orderData.userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //   Transaction
    const order = await db.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          name: orderData.name,
          email: orderData.email,
          address: orderData.address,
          phone: orderData.phone,
          userId: user.id,
        },
      });

      const orderItems = await tx.orderItem.createMany({
        data: items.map(
          (item: { id: string; quantity: number; price: number }) => ({
            ...item,
            orderId: order.id,
          })
        ),
      });

      const payment = await tx.payment.create({
        data: {
          amount: orderData.totalAmount,
          paymentMethod: orderData.paymentMethod,
          bKashNumber: orderData.bKashNumber || null,
          orderId: order.id,
        },
      });

      return { order, orderItems, payment };
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await db.order.findMany({
      include: {
        user: true,
        orderItems: true,
        payment: true,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
