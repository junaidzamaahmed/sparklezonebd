import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Cart() {
  const router = useRouter();
  const { state, removeItem, updateQuantity, itemsCount, total } = useCart();

  const handleCheckout = () => {
    router.push("/checkout");
  };
  return (
    <Sheet>
      <SheetTrigger className="relative">
        <ShoppingCart className="h-6 w-6 text-gray-600" />
        <span className="absolute -top-2 -right-2 h-5 w-5 bg-orange-400 rounded-full text-white text-xs flex items-center justify-center">
          {itemsCount}
        </span>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg z-[110]">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-[calc(100vh-5rem)]">
          <div className="flex-1 overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Your cart is empty
              </div>
            ) : (
              state.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b">
                  <Image
                    height={100}
                    width={100}
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      &#2547;{item.price.toFixed(2)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        className="p-1 rounded-md hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-gray-900 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="p-1 rounded-md hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 rounded-md hover:bg-gray-100 ml-auto"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {state.items.length > 0 && (
            <div className="border-t py-4 space-y-4">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>&#2547;{total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <p>Shipping</p>
                <p>Calculated at checkout</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p>&#2547;{total.toFixed(2)}</p>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-orange-400 text-white py-3 px-4 rounded-full font-medium hover:bg-orange-500 transition-colors"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
