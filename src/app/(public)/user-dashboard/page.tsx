"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Package,
  User,
  Settings,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Order, OrderItem, Product } from "@prisma/client";
import { useUser } from "@clerk/nextjs";

const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "text-green-500";
    case "PROCESSING":
      return "text-orange-500";
    case "CANCELLED":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "PROCESSING":
      return <Clock className="h-5 w-5 text-orange-500" />;
    case "CANCELLED":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
};

export default function Dashboard() {
  const { user } = useUser();
  const [orders, setOrders] = useState<
    (Order & { orderItems: (OrderItem & { product: Product })[] })[]
  >([]);

  useEffect(() => {
    if (!user) return;
    // Fetch orders
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/user/" + user?.id);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };
    fetchOrders();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <Tabs defaultValue="orders" className="w-full">
            <div className="sm:hidden">
              <select
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                defaultValue="orders"
              >
                <option value="orders">Orders</option>
                <option value="profile">Profile</option>
                <option value="settings">Settings</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <TabsList className="flex -mb-px space-x-8 px-6">
                  <TabsTrigger
                    value="orders"
                    className="group inline-flex items-center py-4 px-1 border-b-2 border-transparent font-medium text-sm"
                  >
                    <Package className="mr-2 h-5 w-5" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger
                    value="profile"
                    // className="group inline-flex items-center py-4 px-1 border-b-2 border-transparent font-medium text-sm"
                    className="hidden"
                  >
                    <User className="mr-2 h-5 w-5" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="hidden"
                    // className="group inline-flex items-center py-4 px-1 border-b-2 border-transparent font-medium text-sm"
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <div className="p-6 mt-6">
              <TabsContent value="orders">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Order History</h3>
                    <Link
                      href="/shop"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-400 hover:bg-orange-500"
                    >
                      Continue Shopping
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              {getStatusIcon(order.status)}
                              <div>
                                <p className="text-sm text-gray-500">
                                  Order #{order.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {order.createdAt.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-medium">
                                {order?.totalAmount?.toFixed(2)} Taka
                              </p>
                              <p
                                className={`text-sm ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </p>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <div className="space-y-2">
                              {order.orderItems.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-gray-600">
                                    {item.quantity}x {item.product.name}
                                  </span>
                                  <span className="font-medium">
                                    {(item.price * item.quantity).toFixed(2)}{" "}
                                    Taka
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <Link
                              href={`/user-dashboard/orders/${order.id}`}
                              className="inline-flex items-center text-sm text-orange-400 hover:text-orange-500"
                            >
                              View Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="profile">
                <div className="max-w-2xl">
                  <h3 className="text-lg font-medium mb-6">
                    Profile Information
                  </h3>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={user?.fullName || ""}
                        // onChange={(e) =>
                        //   setUser({ ...user, name: e.target.value })
                        // }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-400 focus:ring focus:ring-orange-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        // value={user.email}
                        // onChange={(e) =>
                        //   setUser({ ...user, email: e.target.value })
                        // }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-400 focus:ring focus:ring-orange-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        // value={user.phone}
                        // onChange={(e) =>
                        //   setUser({ ...user, phone: e.target.value })
                        // }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-400 focus:ring focus:ring-orange-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        // value={user.address}
                        // onChange={(e) =>
                        //   setUser({ ...user, address: e.target.value })
                        // }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-400 focus:ring focus:ring-orange-200"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-400 hover:bg-orange-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="max-w-2xl">
                  <h3 className="text-lg font-medium mb-6">Account Settings</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h4 className="text-base font-medium">
                          Email Notifications
                        </h4>
                        <p className="text-sm text-gray-500">
                          Receive order updates and promotions
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 bg-orange-400">
                        <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h4 className="text-base font-medium">
                          SMS Notifications
                        </h4>
                        <p className="text-sm text-gray-500">
                          Get delivery updates via SMS
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 bg-gray-200">
                        <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b">
                      <div>
                        <h4 className="text-base font-medium">
                          Two-Factor Authentication
                        </h4>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security
                        </p>
                      </div>
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Enable
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-4">
                      <div>
                        <h4 className="text-base font-medium text-red-600">
                          Delete Account
                        </h4>
                        <p className="text-sm text-gray-500">
                          Permanently delete your account
                        </p>
                      </div>
                      <button className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
