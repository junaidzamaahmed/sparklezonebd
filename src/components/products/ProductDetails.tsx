"use client";
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  Star,
  Minus,
  Plus,
  Heart,
  Share2,
  ShoppingCart,
  Check,
} from "lucide-react";
import type { ProductVariant } from "../../app/types/product";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useProducts } from "@/context/ProductsContext";

export default function ProductDetails() {
  const { products } = useProducts();
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem({
        id: product.id,
        name: `${product.name} - ${selectedVariant.sku}`,
        price: selectedVariant.price,
        quantity,
        image: product.images[0],
      });
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
              <Image
                width={400}
                height={400}
                src={product.images?.[selectedImage] || product.images[0]}
                alt={product.name}
                className="h-[30rem] w-full object-cover object-center"
              />
            </div>
            {product.images && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-w-1 aspect-h-1 overflow-hidden rounded-lg ${
                      selectedImage === index ? "ring-2 ring-orange-400" : ""
                    }`}
                  >
                    <Image
                      width={400}
                      height={400}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-36 w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i <
                        Math.floor(
                          (product.reviews?.reduce(
                            (acc, curr) => acc + curr.rating,
                            0
                          ) || 0) / (product.reviews?.length || 1)
                        )
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews?.length} reviews)
                  </span>
                </div>
                <div className="flex space-x-4">
                  <button className="text-gray-400 hover:text-gray-500">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-500">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-gray-600">{product.description}</p>

            {/* Variants */}
            {product.variants && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <div className="grid grid-cols-3 gap-4">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`border rounded-lg py-3 px-4 text-sm font-medium ${
                        selectedVariant?.id === variant.id
                          ? "border-orange-400 bg-orange-50 text-orange-600"
                          : variant.stock != 0
                          ? "border-gray-200 text-gray-900 hover:bg-gray-50"
                          : "border-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!variant.stock}
                    >
                      <span className="block">{variant.sku}</span>
                      <span className="block mt-1">
                        {variant.attributes.size}
                      </span>
                      <span className="block mt-1">
                        ${variant.price.toFixed(2)}
                      </span>
                      {!variant.stock && (
                        <span className="block mt-1 text-xs text-red-500">
                          Out of stock
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.stock}
                className="flex-1 bg-orange-400 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </span>
              </button>
            </div>

            {/* Reviews */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Customer Reviews
              </h3>
              <div className="space-y-6">
                {product.reviews?.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <h4 className="font-medium text-gray-900">
                          {review.title}
                        </h4>
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{review.comment}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          By {review.userName}
                        </span>
                        {review.verified && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
