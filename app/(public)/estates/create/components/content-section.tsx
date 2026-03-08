import { Controller, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CreatePostInput } from "@/features/estate/estate.validation";
import ImageUploader from "./image-uploader";

type Props = {
  form: UseFormReturn<CreatePostInput>;
};

export default function ContentSection({ form }: Props) {
  const { control, register, formState: { errors } } = form;

  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Nội dung</h2>

      <div>
        <p className="mb-3 text-sm text-muted-foreground">Hình ảnh</p>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ImageUploader
              images={(field.value as File[]) ?? []}
              setImages={field.onChange}
            />
          )}
        />
        {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
      </div>

      <Input {...register("title")} placeholder="Tiêu đề" />
      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

      <textarea
        rows={5}
        {...register("description")}
        placeholder="Mô tả"
        className="border-input w-full rounded-md border px-3 py-2 text-sm"
      />
      {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
    </section>
  );
}