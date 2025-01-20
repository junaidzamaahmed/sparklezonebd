import { ProductForm } from "../_components/product-form";

export default function NewProductPage() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Add New Product</h2>
      <ProductForm />
    </div>
  );
}
