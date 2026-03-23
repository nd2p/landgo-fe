import { notFound } from "next/navigation";
import { getEstateBySlug } from "@/features/estate/estate.api";
import EstateGallery from "@/components/estate/estate-gallery";
import EstateAuthorSidebar from "@/components/estate/estate-author-sidebar";
import EstateDetailInfo from "@/components/estate/estate-detail-info";
import EstateMapView from "@/components/estate/estate-map-view";
import EstateRecommendations from "@/components/estate/estate-recommendations";

export default async function EstateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const estate = await getEstateBySlug(slug);

  if (!estate) {
    return notFound();
  }

  return (
    <main className="container mx-auto px-4 py-6 md:py-8 lg:max-w-6xl">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main Content Column */}
        <div className="flex flex-col gap-6 w-full overflow-hidden">
          <EstateGallery images={estate.images} title={estate.title} />

          <EstateDetailInfo estate={estate} />

          <div className="mt-4">
            <h2 className="mb-4 text-xl font-bold md:text-2xl">
              Xem trên bản đồ
            </h2>
            <EstateMapView
              address={estate.addressDetail}
              lat={estate.lat}
              lng={estate.lng}
            />
          </div>

          <EstateRecommendations currentEstate={estate} />
        </div>

        {/* Sidebar Column */}
        <div className="w-full lg:sticky lg:top-8">
          <EstateAuthorSidebar author={estate.author} estate={estate} />
        </div>
      </div>
    </main>
  );
}
