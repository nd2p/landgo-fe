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
  onRedBookFilesSelected?: (files: File[]) => Promise<string | null> | string | null;
  isValidatingRedBookImages?: boolean;
  disableRedBookUpload?: boolean;
  isUpdateScreen?: boolean;
};

export default function LegalSection({
  values,
  errors,
  onFieldChange,
  onRedBookFilesSelected,
  isValidatingRedBookImages = false,
  disableRedBookUpload = false,
  isUpdateScreen = false,
}: Props) {
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
          <option value="false">Giá cố định</option>
        </select>
      </div>

      {!isUpdateScreen && (
        <div>
          <label className="text-sm font-medium">
            Ảnh sổ đỏ <span className="text-red-500">*</span>
          </label>
          <ImageUploader
            images={values.redBookImages}
            setImages={(files) => onFieldChange("redBookImages", files)}
            max={5}
            accept="image/*"
            disabled={disableRedBookUpload || isValidatingRedBookImages}
            onFilesSelected={onRedBookFilesSelected}
          />

          {disableRedBookUpload && (
            <p className="text-sm text-muted-foreground">
              Bạn không thể chỉnh sửa ảnh sổ đỏ!
            </p>
          )}

          {errors.redBookImages && (
            <p className="text-red-500 text-sm">{errors.redBookImages}</p>
          )}
        </div>
      )}
    </section>
  );
}