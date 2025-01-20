import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { UpdateOrderStatus } from "./_components/update-order-status";
import { db } from "@/utils/db";

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Order Details</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> <Badge>{order.status}</Badge>
            </p>
            <p>
              <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Name:</strong> {order.user.name}
            </p>
            <p>
              <strong>Email:</strong> {order.user.email}
            </p>
            <p>
              <strong>Address:</strong> {order.user.address}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {order.orderItems.map((item) => (
              <li key={item.id} className="mb-2">
                {item.product.name} - Quantity: {item.quantity} - Regular Price:
                ${item.product.regularPrice.toFixed(2)}
                {item.product.discountPrice &&
                  ` - Discount Price: $${item.product.discountPrice.toFixed(
                    2
                  )}`}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Payment Method:</strong> {order.payment?.paymentMethod}
          </p>
          <p>
            <strong>Payment Status:</strong>{" "}
            <Badge>{order.payment?.status}</Badge>
          </p>
          {order.payment?.paymentMethod === "BKASH" && (
            <>
              <p>
                <strong>bKash Number:</strong> {order.payment.bKashNumber}
              </p>
              <p>
                <strong>Transaction ID:</strong> {order.payment.transactionId}
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <div className="mt-6">
        <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
      </div>
    </div>
  );
}
