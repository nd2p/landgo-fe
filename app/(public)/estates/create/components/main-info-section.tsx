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
import { PropertyType, PropertyTypeLabel } from "@/features/estate/estate.types";

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

  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Thông tin chính</h2>

      <Controller
        name="propertyType"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Loại bất động sản" />
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

      <Input type="number" placeholder="Diện tích (m²)" {...register("area")} />
      {errors.area && (
        <p className="text-red-500 text-sm">{errors.area.message}</p>
      )}

      {/* Price */}
      <Input
        type="number"
        placeholder="Giá (VNĐ / m²)"
        {...register("price")}
      />
      {errors.price && (
        <p className="text-red-500 text-sm">{errors.price.message}</p>
      )}
    </section>
  );
}
