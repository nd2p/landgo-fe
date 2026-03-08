import { Controller, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CreatePostInput } from "@/features/estate/estate.validation";
import ImageUploader from "./image-uploader";

type Props = {
  form: UseFormReturn<CreatePostInput>;
};

export default function LegalSection({ form }: Props) {
  const { control, register, formState: { errors } } = form;

  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Thông tin pháp lý</h2>

      <Input {...register("legalStatus")} placeholder="Tình trạng pháp lý" />
      {errors.legalStatus && <p className="text-red-500 text-sm">{errors.legalStatus.message}</p>}

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Ảnh sổ đỏ</p>
        <Controller
          name="redBookImages"
          control={control}
          render={({ field }) => (
            <ImageUploader
              images={(field.value as File[]) ?? []}
              setImages={field.onChange}
            />
          )}
        />
        {errors.redBookImages && (
          <p className="text-red-500 text-sm">{errors.redBookImages.message}</p>
        )}
      </div>
    </section>
  );
}