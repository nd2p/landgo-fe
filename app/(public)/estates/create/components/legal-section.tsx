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

export default function LegalSection({ values, errors, onFieldChange }: Props) {
  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Thông tin pháp lý</h2>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Giá cả</label>
        <select
          className="border-input w-full rounded-md border px-3 py-2 text-sm"
          value={values.isNegotiable ? "true" : "false"}
          onChange={(event) =>
            onFieldChange("isNegotiable", event.target.value === "true")
          }
          required
        >
          <option value="true">Có thể thương lượng</option>
          <option value="false">Giá cả cố định</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">
          Ảnh sổ đỏ <span className="text-red-500">*</span>
        </label>
        <ImageUploader
          images={values.redBookImages}
          setImages={(files) => onFieldChange("redBookImages", files)}
          max={5}
        />
        {errors.redBookImages && (
          <p className="text-red-500 text-sm">{errors.redBookImages}</p>
        )}
      </div>
    </section>
  );
}
