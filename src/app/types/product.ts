// export type Product = {
//   id: string;
//   name: string;
//   description?: string;
//   regularPrice: number;
//   discountPrice?: number;
//   stock: number;
//   images: string[];
//   category: { id: string; name: string };
//   brand: { id: string; name: string };
//   createdAt: Date;
//   tag?: string;
//   rating?: number;
//   variants?: {
//     id: number;
//     name: string;
//     price: number;
//     size: string;
//     inStock: boolean;
//   }[];
//   reviews?: {
//     id: number;
//     userName: string;
//     rating: number;
//     date: string;
//     title: string;
//     comment: string;
//     helpful: number;
//     verified: boolean;
//   }[];
// };

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  regularPrice: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  category: {
    id: string;
    name: string;
  };
  brand: {
    id: string;
    name: string;
    image?: string;
  };
  attributes?: ProductAttribute[];
  variants?: ProductVariant[];
  createdAt?: Date;
  tag?: string;
  rating?: number;
  reviews?: {
    id: number;
    userName: string;
    rating: number;
    date: string;
    title: string;
    comment: string;
    helpful: number;
    verified: boolean;
  }[];
}
