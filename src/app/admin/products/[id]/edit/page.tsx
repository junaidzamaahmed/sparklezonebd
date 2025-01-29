import { db } from "@/utils/db";
import { ProductForm } from "../../_components/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      attributes: true,
      variants: true,
    },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <ProductForm product={product} />
    </div>
  );
}
