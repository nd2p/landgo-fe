import { Input } from "@/components/ui/input";
import type {
  EstateFormErrors,
  EstateFormState,
  FieldChangeHandler,
} from "@/features/estate/estate.form";
import ImageUploader from "./image-uploader";

type Props = {
  values: EstateFormState;
  errors: EstateFormErrors;
  onFieldChange: FieldChangeHandler;
};

export default function ContentSection({ values, errors, onFieldChange }: Props) {
  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Nội dung</h2>

      <div>
        <p className="mb-3 text-sm text-muted-foreground">Hình ảnh</p>
        <ImageUploader
          images={values.images}
          setImages={(files) => onFieldChange("images", files)}
        />
        {errors.images && (
          <p className="text-red-500 text-sm">{errors.images}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Tiêu đề</label>
        <Input
          value={values.title}
          onChange={(event) => onFieldChange("title", event.target.value)}
          placeholder="Tiêu đề"
          required
        />
      </div>
      {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Mô tả</label>
        <textarea
          rows={5}
          value={values.description}
          onChange={(event) => onFieldChange("description", event.target.value)}
          placeholder="Mô tả"
          className="border-input w-full rounded-md border px-3 py-2 text-sm"
          required
        />
      </div>
      {errors.description && (
        <p className="text-red-500 text-sm">{errors.description}</p>
      )}
    </section>
  );
}
