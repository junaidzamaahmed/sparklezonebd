"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, X } from "lucide-react";
import {
  Brand,
  Category,
  Product,
  ProductAttribute,
  ProductVariant,
} from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";

export function ProductForm({
  product,
}: {
  product?: Product & {
    attributes: ProductAttribute[];
    variants: ProductVariant[];
  };
}) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [attributes, setAttributes] = useState<ProductAttribute[]>(
    product?.attributes || []
  );
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants || []
  );
  const [variantAttributes, setVariantAttributes] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  async function fetchCategories() {
    const response = await fetch("/api/categories");
    const data = await response.json();
    setCategories(data);
  }

  async function fetchBrands() {
    const response = await fetch("/api/brands");
    const data = await response.json();
    setBrands(data);
  }

  function addAttribute() {
    setAttributes([
      ...attributes,
      { id: "", name: "", value: "", productId: product?.id || "" },
    ]);
  }

  function removeAttribute(index: number) {
    setAttributes(attributes.filter((_, i) => i !== index));
  }

  function updateAttribute(
    index: number,
    field: keyof ProductAttribute,
    value: string
  ) {
    const newAttributes = [...attributes];
    newAttributes[index] = {
      ...newAttributes[index],
      [field]: value,
    };
    setAttributes(newAttributes);
  }

  function toggleVariantAttribute(attributeName: string) {
    setVariantAttributes((prev: string[]) =>
      prev.includes(attributeName)
        ? prev.filter((attr) => attr !== attributeName)
        : [...prev, attributeName]
    );
  }

  function generateVariants() {
    const selectedAttributes = attributes.filter((attr) =>
      variantAttributes.includes(attr.name)
    );
    const attributeCombinations = cartesianProduct(
      selectedAttributes.map((attr) => attr.value.split(","))
    );

    const newVariants = attributeCombinations.map((combination, index) => {
      const variantAttributes: Record<string, string> = {};
      combination.forEach((value, i) => {
        variantAttributes[selectedAttributes[i].name] = value.trim();
      });

      return {
        id: "",
        productId: product?.id || "",
        sku: `SKU-${index + 1}`,
        price: Number(product?.regularPrice) || 0,
        stock: Number(product?.stock) || 0,
        attributes: variantAttributes,
      } as ProductVariant;
    });

    setVariants(newVariants);
  }

  function cartesianProduct(arrays: string[][]): string[][] {
    return arrays.reduce<string[][]>(
      (acc, array) => acc.flatMap((x) => array.map((y) => [...x, y])),
      [[]]
    );
  }

  function updateVariant(index: number, field: string, value: string | object) {
    const newVariants = [...variants];
    if (field === "attributes") {
      newVariants[index].attributes = value;
    } else {
      newVariants[index] = {
        ...newVariants[index],
        [field]: value,
      };
    }
    setVariants(newVariants);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      regularPrice: formData.get("regularPrice"),
      discountPrice: formData.get("discountPrice"),
      stock: formData.get("stock"),
      categoryId: formData.get("categoryId"),
      brandId: formData.get("brandId"),
      attributes,
      variants,
    };

    const url = product ? `/api/products/${product.id}` : "/api/products";
    const method = product ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    setLoading(false);

    if (response.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      // Handle error
      console.error("Failed to save product");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description || ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="regularPrice">Regular Price</Label>
        <Input
          id="regularPrice"
          name="regularPrice"
          type="number"
          step="0.01"
          defaultValue={product?.regularPrice}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="discountPrice">Discount Price (optional)</Label>
        <Input
          id="discountPrice"
          name="discountPrice"
          type="number"
          step="0.01"
          defaultValue={product?.discountPrice || ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="stock">Stock</Label>
        <Input
          id="stock"
          name="stock"
          type="number"
          defaultValue={product?.stock || ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <Select name="categoryId" defaultValue={product?.categoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category: Category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="brandId">Brand</Label>
        <Select name="brandId" defaultValue={product?.brandId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand: Brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Product Attributes</h3>
          <Button
            type="button"
            onClick={addAttribute}
            variant="outline"
            size="sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Attribute
          </Button>
        </div>
        {attributes.map((attr: ProductAttribute, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              placeholder="Attribute Name"
              value={attr.name}
              onChange={(e) => updateAttribute(index, "name", e.target.value)}
              required
            />
            <Input
              placeholder="Attribute Values (comma-separated)"
              value={attr.value}
              onChange={(e) => updateAttribute(index, "value", e.target.value)}
              required
            />
            <Checkbox
              checked={variantAttributes.includes(attr.name)}
              onCheckedChange={() => toggleVariantAttribute(attr.name)}
            />
            <Label>Use for variants</Label>

            <Button
              type="button"
              onClick={() => removeAttribute(index)}
              variant="ghost"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Product Variants</h3>
          <Button
            type="button"
            onClick={generateVariants}
            variant="outline"
            size="sm"
          >
            Generate Variants
          </Button>
        </div>
        {variants.map((variant, index) => (
          <div key={index} className="space-y-2 p-4 border rounded-md">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              placeholder="SKU"
              value={variant.sku}
              onChange={(e) => updateVariant(index, "sku", e.target.value)}
              required
            />
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              placeholder="Price"
              type="number"
              step="0.01"
              value={variant.price}
              onChange={(e) => updateVariant(index, "price", e.target.value)}
              required
            />
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              placeholder="Stock"
              type="number"
              value={variant.stock}
              onChange={(e) => updateVariant(index, "stock", e.target.value)}
              required
            />
            <Label htmlFor="attributes">Attributes</Label>
            {Object.entries(variant.attributes as Record<string, string>).map(
              ([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Label>{key}</Label>
                  <Input
                    value={String(value)}
                    onChange={(e) =>
                      updateVariant(index, "attributes", {
                        ...(variant.attributes as Record<string, string>),
                        [key]: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              )
            )}
          </div>
        ))}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}
