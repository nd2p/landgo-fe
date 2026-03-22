import { Controller, UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CreatePostInput } from "@/features/estate/estate.validation";
import { IDistrict, IProvince, IWard } from "@/features/location/location.type";

type Props = {
  form: UseFormReturn<CreatePostInput>;
  provinces: IProvince[];
  districts: IDistrict[];
  wards: IWard[];
  onProvinceChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
};

export default function AddressSection({
  form,
  provinces,
  districts,
  wards,
  onProvinceChange,
  onDistrictChange,
}: Props) {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Địa chỉ</h2>

      <Controller
        name="province"
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              onProvinceChange(value);
            }}
          >
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
        )}
      />
      {errors.province && (
        <p className="text-red-500 text-sm">{errors.province.message}</p>
      )}

      <Controller
        name="district"
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              onDistrictChange(value);
            }}
          >
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
        )}
      />
      {errors.district && (
        <p className="text-red-500 text-sm">{errors.district.message}</p>
      )}

      <Controller
        name="ward"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
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
        )}
      />
      {errors.ward && (
        <p className="text-red-500 text-sm">{errors.ward.message}</p>
      )}

      <Input
        {...register("addressDetail")}
        placeholder="Địa chỉ chi tiết (tuỳ chọn)"
      />
      {errors.addressDetail && (
        <p className="text-red-500 text-sm">{errors.addressDetail.message}</p>
      )}

      {/* <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Vĩ độ</label>
          <Input
            type="number"
            placeholder="Vĩ độ"
            {...register("lat")}
            required
          />
          {errors.lat && (
            <p className="text-red-500 text-sm">{errors.lat.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Kinh độ</label>
          <Input
            type="number"
            placeholder="Kinh độ"
            {...register("lng")}
            required
          />
          {errors.lng && (
            <p className="text-red-500 text-sm">{errors.lng.message}</p>
          )}
        </div>
      </div> */}
    </section>
  );
}
