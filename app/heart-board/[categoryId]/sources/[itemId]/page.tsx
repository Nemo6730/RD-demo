import { HeartBoardSourcesClientPage } from "@/app/components/HeartBoardSourcesClientPage";

type SourcesPageProps = {
  params: Promise<{ categoryId: string; itemId: string }>;
};

export default async function ItemSourcesPage({ params }: SourcesPageProps) {
  const { categoryId, itemId } = await params;
  return <HeartBoardSourcesClientPage categoryId={categoryId} itemId={itemId} />;
}
