import { HeartBoardCategoryClientPage } from "@/app/components/HeartBoardCategoryClientPage";

type CategoryPageProps = {
  params: Promise<{ categoryId: string }>;
};

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  return <HeartBoardCategoryClientPage categoryId={categoryId} />;
}
