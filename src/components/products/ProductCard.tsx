import React from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Product } from "@/app/types/product";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the cart button
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.regularPrice,
      quantity: 1,
      image: product.images[0],
    });
  };

  const price = product.discountPrice || product.regularPrice;

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      {product.discountPrice && (
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            {Math.round(
              ((product.regularPrice - product.discountPrice) /
                product.regularPrice) *
                100
            )}
            % OFF
          </span>
        </div>
      )}
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-xl">
        <Link href={`/product/${product.id}`} className="block">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className="h-60 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500">{product.category.name}</p>
          <p className="text-sm text-gray-500">{product.brand.name}</p>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          <Link href={`/product/${product.id}`} className="block">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold text-gray-900">
              ${price.toFixed(2)}
            </p>
            {product.discountPrice && (
              <p className="text-sm text-gray-500 line-through">
                ${product.regularPrice.toFixed(2)}
              </p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center rounded-full bg-orange-100 p-2 text-orange-600 hover:bg-orange-200 transition-colors duration-200"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
        {product.stock === 0 && (
          <p className="mt-2 text-sm text-red-500">Out of stock</p>
        )}
      </div>
    </div>
  );
}
