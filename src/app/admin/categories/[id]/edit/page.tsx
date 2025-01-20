import { db } from "@/utils/db";
import { CategoryForm } from "../../_components/category-form";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const category = await db.category.findUnique({
    where: { id: id },
    include: { parentCategory: true },
  });

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Edit Category</h2>
      <CategoryForm category={category} />
    </div>
  );
}
