import { Button } from "@/components/ui/button";

interface EstateMapViewProps {
  address: string;
  lat: number;
  lng: number;
}

export default function EstateMapView({
  address,
  lat,
  lng,
}: EstateMapViewProps) {
  // If we have actual coordinates, we use them. Otherwise, we fallback to the address.
  // If both are missing, we use a generic location as a final fallback to prevent 'Invalid q parameter' error.
  const query =
    lat && lng && lat !== 0 && lng !== 0
      ? `${lat},${lng}`
      : address
        ? encodeURIComponent(address)
        : encodeURIComponent("Vietnam");

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const hasCoordinates = lat !== 0 && lng !== 0;
  const fullMapUrl = hasCoordinates
    ? `https://www.google.com/maps/@${lat},${lng},15z`
    : address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : "https://www.google.com/maps";

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="mt-2 h-100 w-full overflow-hidden rounded-xl border border-border bg-muted shadow-inner">
        {apiKey ? (
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
            <div className="text-center px-4">
              <p className="font-semibold">Google Maps API Key Missing</p>
              <p className="text-sm mt-1">
                Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-t border-border">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Ngày đăng</span>
          <span className="text-sm font-medium">10/03/2026</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Ngày hết hạn</span>
          <span className="text-sm font-medium">25/03/2026</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Loại tin</span>
          <span className="text-sm font-medium">Tin thường</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Mã tin</span>
          <span className="text-sm font-medium">44605862</span>
        </div>
      </div>
    </div>
  );
}
