import { db } from "@/utils/db";
import { BrandForm } from "../../_components/brand-form";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await db.brand.findUnique({
    where: { id: id },
  });

  if (!brand) {
    return <div>Brand not found</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Edit Brand</h2>
      <BrandForm brand={brand} />
    </div>
  );
}
