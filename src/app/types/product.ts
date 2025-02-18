import { Category } from "@prisma/client";

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  name: string;
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
  category: Category & {
    subCategories: Category[];
    parentCategoryId: string | null;
    parentCategory: Category | null;
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
