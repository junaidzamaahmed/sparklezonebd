"use client";
import { useParams } from "next/navigation";
import { CheckCircle, Package, Truck, Clock } from "lucide-react";
import Link from "next/link";

export default function OrderConfirmation() {
  const { id } = useParams();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Thank you for your order. Your order number is:
            </p>
            <p className="mt-2 text-2xl font-mono font-medium text-orange-500">
              #{id}
            </p>
          </div>

          <div className="mt-12">
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-8 w-8 text-orange-400" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium">Order Processing</h2>
                  <p className="mt-1 text-gray-600">
                    We&apos;re processing your order and will notify you when
                    it&apos;s ready for shipping.
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Truck className="h-8 w-8 text-orange-400" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium">Delivery Information</h2>
                  <p className="mt-1 text-gray-600">
                    You&apos;ll receive a shipping confirmation email with
                    tracking details once your order is shipped.
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-orange-400" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium">Estimated Delivery</h2>
                  <p className="mt-1 text-gray-600">
                    Your order is expected to arrive within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <Link
              href="/shop"
              className="block w-full text-center bg-orange-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-500 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href={`/orders/${id}`}
              className="block w-full text-center bg-white text-orange-400 py-3 px-4 rounded-lg font-medium border border-orange-400 hover:bg-orange-50 transition-colors"
            >
              View Order Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
