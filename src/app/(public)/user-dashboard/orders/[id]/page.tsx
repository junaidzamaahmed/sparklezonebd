"use client";
import React, { useState } from "react";
import {
  Package,
  Truck,
  MapPin,
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCcw,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Mock data - replace with actual API call
const getOrder = (id: string) => ({
  id,
  status: "PROCESSING",
  date: "2024-03-20",
  totalAmount: 124.99,
  shippingAddress: "123 Main St, City, Country",
  paymentMethod: "CASH_ON_DELIVERY",
  items: [
    {
      id: "1",
      name: "Revolution Pro Hydra Cream",
      quantity: 2,
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "2",
      name: "Revolution Beauty Palette",
      quantity: 1,
      price: 25.01,
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
  ],
  timeline: [
    {
      date: "2024-03-20 14:30",
      status: "Order Placed",
      description: "Your order has been confirmed",
    },
    {
      date: "2024-03-20 15:45",
      status: "Processing",
      description: "We are preparing your items",
    },
  ],
  canCancel: true,
  canReturn: false,
  estimatedDelivery: "2024-03-25",
});

const getStatusDetails = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return {
        icon: <CheckCircle className="h-6 w-6 text-green-500" />,
        color: "text-green-500",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    case "PROCESSING":
      return {
        icon: <Clock className="h-6 w-6 text-orange-500" />,
        color: "text-orange-500",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      };
    case "CANCELLED":
      return {
        icon: <XCircle className="h-6 w-6 text-red-500" />,
        color: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    default:
      return {
        icon: <AlertCircle className="h-6 w-6 text-gray-500" />,
        color: "text-gray-500",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      };
  }
};

export default function OrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const order = getOrder(id as string);
  const statusDetails = getStatusDetails(order.status);

  const handleCancelOrder = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement order cancellation API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/user-dashboard");
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnOrder = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement return initiation API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/user-dashboard");
    } catch (error) {
      console.error("Failed to initiate return:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/user-dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                <p className="text-sm text-gray-500">Placed on {order.date}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ${order.totalAmount.toFixed(2)}
                </p>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full ${statusDetails.bgColor} ${statusDetails.color} text-sm font-medium`}
                >
                  {statusDetails.icon}
                  <span className="ml-2">{order.status}</span>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div
              className={`mb-6 p-4 rounded-lg border ${statusDetails.borderColor} ${statusDetails.bgColor}`}
            >
              <div className="flex items-center">
                <Truck className={`h-5 w-5 ${statusDetails.color}`} />
                <div className="ml-3">
                  <p className="text-sm font-medium">Estimated Delivery</p>
                  <p className="text-sm text-gray-600">
                    {order.estimatedDelivery}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border rounded-lg overflow-hidden mb-6">
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Shipping Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Shipping Information</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="ml-3">
                      <p className="text-sm font-medium">Delivery Address</p>
                      <p className="text-sm text-gray-500">
                        {order.shippingAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Payment Information</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Payment Method
                      </span>
                      <span className="text-sm font-medium">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Subtotal</span>
                      <span className="text-sm font-medium">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Shipping</span>
                      <span className="text-sm font-medium">Free</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-medium mb-4">Order Timeline</h2>
              <div className="flow-root">
                <ul className="-mb-8">
                  {order.timeline.map((event, index) => (
                    <li key={index}>
                      <div className="relative pb-8">
                        {index !== order.timeline.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center ring-8 ring-white">
                              {index === 0 ? (
                                <Package className="h-5 w-5 text-orange-500" />
                              ) : index === order.timeline.length - 1 ? (
                                <Clock className="h-5 w-5 text-orange-500" />
                              ) : (
                                <Truck className="h-5 w-5 text-orange-500" />
                              )}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <p className="text-sm text-gray-500">
                                {event.date}
                              </p>
                            </div>
                            <div className="mt-1">
                              <p className="text-sm font-medium">
                                {event.status}
                              </p>
                              <p className="text-sm text-gray-500">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 flex flex-col sm:flex-row gap-4">
              {order.canCancel && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel Order
                </button>
              )}
              {order.canReturn && (
                <button
                  onClick={handleReturnOrder}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Return Order
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Print Order
              </button>
            </div>

            {/* Cancel Confirmation Dialog */}
            {showCancelConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-lg font-medium mb-4">Cancel Order</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to cancel this order? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      No, keep order
                    </button>
                    <button
                      onClick={handleCancelOrder}
                      disabled={isLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <RefreshCcw className="h-5 w-5 animate-spin" />
                      ) : (
                        "Yes, cancel order"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
