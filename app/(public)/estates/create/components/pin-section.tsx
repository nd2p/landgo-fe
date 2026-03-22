import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CreatePostInput } from "@/features/estate/estate.validation";

type Props = {
  form: UseFormReturn<CreatePostInput>;
};

export default function PinSection({ form }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Ghim tin</h2>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" className="h-4 w-4" {...register("isPinned")} />
        <span>Kích hoạt ghim tin</span>
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Pin level
          </label>
          <Input
            type="number"
            placeholder="Pin level"
            {...register("pinLevel", {
              setValueAs: (value) => (value === "" ? null : Number(value)),
            })}
          />
          {errors.pinLevel && (
            <p className="text-red-500 text-sm">{errors.pinLevel.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Hạn ghim
          </label>
          <Input
            type="datetime-local"
            placeholder="Hạn ghim"
            {...register("pinExpiredAt", {
              setValueAs: (value) => (value === "" ? null : value),
            })}
          />
          {errors.pinExpiredAt && (
            <p className="text-red-500 text-sm">
              {errors.pinExpiredAt.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
