import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type {
  EstateFormErrors,
  EstateFormState,
  FieldChangeHandler,
} from "@/features/estate/estate.form";
import { IDistrict, IProvince, IWard } from "@/features/location/location.type";

type Props = {
  values: EstateFormState;
  errors: EstateFormErrors;
  provinces: IProvince[];
  districts: IDistrict[];
  wards: IWard[];
  onFieldChange: FieldChangeHandler;
  onProvinceChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  showMapUrlInput?: boolean;
};

export default function AddressSection({
  values,
  errors,
  provinces,
  districts,
  wards,
  onFieldChange,
  onProvinceChange,
  onDistrictChange,
  showMapUrlInput = false,
}: Props) {
  const hasCoordinates =
    typeof values.lat === "number" &&
    typeof values.lng === "number" &&
    values.lat !== 0 &&
    values.lng !== 0;

  const mapPreviewUrl = hasCoordinates
    ? `https://maps.google.com/maps?q=${values.lat},${values.lng}&z=15&output=embed`
    : null;

  const fullMapUrl = values.mapUrl.trim()
    ? values.mapUrl.trim()
    : hasCoordinates
      ? `https://www.google.com/maps/@${values.lat},${values.lng},15z`
      : "";

  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">
        Địa chỉ <span className="text-red-500">*</span>
      </h2>

      <Select value={values.province} onValueChange={onProvinceChange}>
        <SelectTrigger className="w-full" aria-required="true">
          <SelectValue placeholder="Tỉnh / Thành phố" />
        </SelectTrigger>
        <SelectContent>
          {provinces.map((p) => (
            <SelectItem key={p._id} value={String(p._id)}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.province && (
        <p className="text-red-500 text-sm">{errors.province}</p>
      )}

      <Select value={values.district} onValueChange={onDistrictChange}>
        <SelectTrigger className="w-full" aria-required="true">
          <SelectValue placeholder="Quận / Huyện" />
        </SelectTrigger>
        <SelectContent>
          {districts.map((d) => (
            <SelectItem key={d._id} value={String(d._id)}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.district && (
        <p className="text-red-500 text-sm">{errors.district}</p>
      )}

      <Select
        value={values.ward}
        onValueChange={(value) => onFieldChange("ward", value)}
      >
        <SelectTrigger className="w-full" aria-required="true">
          <SelectValue placeholder="Phường / Xã" />
        </SelectTrigger>
        <SelectContent>
          {wards.map((w) => (
            <SelectItem key={w._id} value={String(w._id)}>
              {w.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.ward && <p className="text-red-500 text-sm">{errors.ward}</p>}

      <Input
        value={values.addressDetail}
        onChange={(event) => onFieldChange("addressDetail", event.target.value)}
        placeholder="Địa chỉ chi tiết (tuỳ chọn)"
      />
      {errors.addressDetail && (
        <p className="text-red-500 text-sm">{errors.addressDetail}</p>
      )}

      {showMapUrlInput && (
        <>
          <Input
            value={values.mapUrl}
            onChange={(event) => onFieldChange("mapUrl", event.target.value)}
            placeholder="Dán link Google Maps để lấy tọa độ (tuỳ chọn)"
          />
          {errors.mapUrl && <p className="text-red-500 text-sm">{errors.mapUrl}</p>}

          {hasCoordinates && mapPreviewUrl && (
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                Tọa độ: {values.lat}, {values.lng}
              </p>
              <div className="h-64 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <iframe
                  title="Google Map Preview"
                  src={mapPreviewUrl}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
