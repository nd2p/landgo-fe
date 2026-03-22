import { getPosts } from "@/features/estate/estate.api";
import EstateCard from "@/components/estate/estate-card";
import type { Estate } from "@/features/estate/estate.types";

interface EstateRecommendationsProps {
  currentEstate: Estate;
}

export default async function EstateRecommendations({ currentEstate }: EstateRecommendationsProps) {
  try {
    const districtId = typeof currentEstate.district === 'object' ? currentEstate.district?._id : currentEstate.district;

    const recommendations = await getPosts({
      propertyType: currentEstate.propertyType,
      district: districtId,
    });

    // Filter out the current estate
    let finalRecommendations = recommendations
      .filter((estate) => estate._id !== currentEstate._id)
      .slice(0, 9);

    if (finalRecommendations.length === 0) {
      const latestEstates = await getPosts({});
      finalRecommendations = latestEstates
        .filter((estate) => estate._id !== currentEstate._id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 9);
    }

    if (finalRecommendations.length === 0) {
      return null;
    }

    return (
      <div className="border-t border-border pt-8">
        <h2 className="mb-6 text-2xl font-bold">Bất động sản dành cho bạn</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {finalRecommendations.map((estate) => (
            <EstateCard key={estate._id} estate={estate} viewMode="grid" />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return null;
  }
}
