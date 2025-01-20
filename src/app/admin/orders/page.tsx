"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import Link from "next/link";

// Dummy data
const orders = [
  {
    id: "1",
    user: { name: "John Doe" },
    createdAt: new Date("2023-06-01"),
    status: "DELIVERED",
    totalAmount: 59.99,
    paymentMethod: "BKASH",
  },
  {
    id: "2",
    user: { name: "Jane Smith" },
    createdAt: new Date("2023-06-02"),
    status: "PROCESSING",
    totalAmount: 129.99,
    paymentMethod: "CASH_ON_DELIVERY",
  },
  {
    id: "3",
    user: { name: "Bob Johnson" },
    createdAt: new Date("2023-06-03"),
    status: "SHIPPED",
    totalAmount: 89.99,
    paymentMethod: "BKASH",
  },
];

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const paymentMethods = ["CASH_ON_DELIVERY", "BKASH"];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      (order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.includes(searchTerm)) &&
      (statusFilter === "" || order.status === statusFilter) &&
      (paymentMethodFilter === "" ||
        order.paymentMethod === paymentMethodFilter)
  );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Orders</h2>
      <div className="flex space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={paymentMethodFilter}
          onValueChange={setPaymentMethodFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Methods</SelectItem>
            {paymentMethods.map((method) => (
              <SelectItem key={method} value={method}>
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "DELIVERED" ? "secondary" : "default"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
