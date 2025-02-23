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

    // const order = await db.order.create({
    //   data: {
    //     name: orderData.name,
    //     email: orderData.email,
    //     address: orderData.address,
    //     phone: orderData.phone,
    //     userId: user.id,
    //     orderItems: {
    //       create: items.map(
    //         (item: { id: string; quantity: number; price: number }) => ({
    //           productId: item.id,
    //           quantity: item.quantity,
    //           price: item.price,
    //         })
    //       ),
    //     },
    //     payment: {
    //       create: {
    //         amount: orderData.totalAmount,
    //         paymentMethod: orderData.paymentMethod,
    //         bKashNumber: orderData.bKashNumber || null,
    //       },
    //     },
    //   },
    // });
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
