import { notFound } from "next/navigation";
import { HeartBoardDetail } from "@/app/components/HeartBoardDetail";
import { getHeartBoardCategoryById } from "@/data/mockHeartBoard";

type CategoryPageProps = {
  params: Promise<{ categoryId: string }>;
};

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const category = getHeartBoardCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  return <HeartBoardDetail category={category} />;
}
