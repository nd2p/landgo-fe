import { Controller, UseFormReturn, useWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CreatePostInput } from "@/features/estate/estate.validation";
import {
  PropertyType,
  PropertyTypeLabel,
} from "@/features/estate/estate.types";

type Props = {
  form: UseFormReturn<CreatePostInput>;
  propertyTypes: PropertyType[];
};

export default function MainInfoSection({ form, propertyTypes }: Props) {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  const propertyType = useWatch({ control, name: "propertyType" });
  const isLocked = !propertyType;

  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Thông tin chính</h2>

      <Controller
        name="propertyType"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-full" aria-required="true">
              <SelectValue placeholder="Loại hình bất động sản" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((p) => (
                <SelectItem key={p} value={p}>
                  {PropertyTypeLabel[p]}{" "}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.propertyType && (
        <p className="text-red-500 text-sm">{errors.propertyType.message}</p>
      )}

      <div className={isLocked ? "space-y-4 opacity-60" : "space-y-4"}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Diện tích (m²)
          </label>
          <Input
            type="number"
            placeholder="m²"
            {...register("area")}
            required
            disabled={isLocked}
          />
          {errors.area && (
            <p className="text-red-500 text-sm">{errors.area.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Giá (VNĐ / m²)
          </label>
          <Input
            type="number"
            placeholder="VNĐ / m²"
            {...register("price")}
            required
            disabled={isLocked}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 p-4 space-y-3">
          <p className="text-sm font-medium text-slate-700">
            Thông tin bổ sung
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Số phòng ngủ
              </label>
              <Input
                type="number"
                placeholder="Số phòng ngủ"
                {...register("numberOfBedrooms")}
                required
                disabled={isLocked}
              />
              {errors.numberOfBedrooms && (
                <p className="text-red-500 text-sm">
                  {errors.numberOfBedrooms.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Số phòng tắm
              </label>
              <Input
                type="number"
                placeholder="Số phòng tắm"
                {...register("numberOfBathrooms")}
                required
                disabled={isLocked}
              />
              {errors.numberOfBathrooms && (
                <p className="text-red-500 text-sm">
                  {errors.numberOfBathrooms.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Mặt tiền
              </label>
              <Input
                type="number"
                placeholder="m²"
                {...register("frontage")}
                disabled={isLocked}
              />
              {errors.frontage && (
                <p className="text-red-500 text-sm">
                  {errors.frontage.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Diện tích lối vào
              </label>
              <Input
                type="number"
                placeholder="m²"
                {...register("entryWidth")}
                disabled={isLocked}
              />
              {errors.entryWidth && (
                <p className="text-red-500 text-sm">
                  {errors.entryWidth.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Hướng nhà
              </label>
              <Input
                placeholder="Hướng nhà"
                {...register("direction")}
                disabled={isLocked}
              />
              {errors.direction && (
                <p className="text-red-500 text-sm">
                  {errors.direction.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Số tầng
              </label>
              <Input
                type="number"
                placeholder="0"
                {...register("floorNumber")}
                disabled={isLocked}
              />
              {errors.floorNumber && (
                <p className="text-red-500 text-sm">
                  {errors.floorNumber.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
