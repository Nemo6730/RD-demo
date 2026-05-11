import { HeartBoardDetail } from "@/app/components/HeartBoardDetail";
import { getHeartBoardCategoryById } from "@/data/mockHeartBoard";
import { notFound } from "next/navigation";

export default function FoundationDetailPage() {
  const category = getHeartBoardCategoryById("foundation");
  if (!category) notFound();
  return <HeartBoardDetail category={category} />;
}
