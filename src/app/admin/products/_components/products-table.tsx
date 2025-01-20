"use client";

import { useState, useEffect } from "react";
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
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { DeleteProduct } from "./delete-product";

type Product = {
  id: string;
  name: string;
  regularPrice: number;
  discountPrice?: number;
  stock: number;
  category: { id: string; name: string };
  brand: { id: string; name: string };
};

type Category = {
  id: string;
  name: string;
};

type Brand = {
  id: string;
  name: string;
};

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
      // Find unique categories and brands by their id
      const productsWithCategories = data.map(
        (product: Product) => product.category
      );
      let uniqueCategories = Array.from(
        new Set(productsWithCategories)
      ) as Category[];
      uniqueCategories = uniqueCategories.filter(
        (category, index, self) =>
          index === self.findIndex((t) => t.id === category.id)
      );

      const productsWithBrands = data.map((product: Product) => product.brand);
      let uniqueBrands = Array.from(new Set(productsWithBrands)) as Brand[];
      uniqueBrands = uniqueBrands.filter(
        (brand, index, self) =>
          index === self.findIndex((t) => t.id === brand.id)
      );
      setCategories(uniqueCategories);
      setBrands(uniqueBrands);
    } catch (error) {
      console.error(error);
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "" ||
        categoryFilter === "all" ||
        product.category.id === categoryFilter) &&
      (brandFilter === "" ||
        brandFilter === "all" ||
        product.brand.id === brandFilter)
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Products</h2>
        <div className="space-x-2">
          <Button asChild>
            <Link href="/admin/brands">Manage Brands</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/categories">Manage Categories</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={brandFilter} onValueChange={setBrandFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Regular Price</TableHead>
              <TableHead>Discount Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{product.brand.name}</TableCell>
                <TableCell>${product.regularPrice.toFixed(2)}</TableCell>
                <TableCell>
                  {product.discountPrice
                    ? `$${product.discountPrice.toFixed(2)}`
                    : "-"}
                </TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm" className="mr-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  <DeleteProduct id={product.id} onDelete={fetchProducts} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
