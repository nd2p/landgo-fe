import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  parseNumberInput,
  type EstateFormErrors,
  type EstateFormState,
  type FieldChangeHandler,
} from "@/features/estate/estate.form";
import {
  PropertyType,
  PropertyTypeLabel,
} from "@/features/estate/estate.types";

type Props = {
  values: EstateFormState;
  errors: EstateFormErrors;
  onFieldChange: FieldChangeHandler;
  propertyTypes: PropertyType[];
};

export default function MainInfoSection({
  values,
  errors,
  onFieldChange,
  propertyTypes,
}: Props) {
  const isLocked = !values.propertyType;

  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">
        Thông tin chính <span className="text-red-500">*</span>
      </h2>

      <Select
        value={values.propertyType}
        onValueChange={(value) =>
          onFieldChange("propertyType", value as PropertyType)
        }
      >
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
      {errors.propertyType && (
        <p className="text-red-500 text-sm">{errors.propertyType}</p>
      )}

      <div className={isLocked ? "space-y-4 opacity-60" : "space-y-4"}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Diện tích (m²)
          </label>
          <Input
            type="number"
            placeholder="m²"
            value={values.area ?? ""}
            onChange={(event) =>
              onFieldChange("area", parseNumberInput(event.target.value))
            }
            required
            disabled={isLocked}
          />
          {errors.area && <p className="text-red-500 text-sm">{errors.area}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Giá (VNĐ / m²)
          </label>
          <Input
            type="number"
            placeholder="VNĐ / m²"
            value={values.price ?? ""}
            onChange={(event) =>
              onFieldChange("price", parseNumberInput(event.target.value))
            }
            required
            disabled={isLocked}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
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
                value={values.numberOfBedrooms ?? ""}
                onChange={(event) =>
                  onFieldChange(
                    "numberOfBedrooms",
                    parseNumberInput(event.target.value),
                  )
                }
                required
                disabled={isLocked}
              />
              {errors.numberOfBedrooms && (
                <p className="text-red-500 text-sm">
                  {errors.numberOfBedrooms}
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
                value={values.numberOfBathrooms ?? ""}
                onChange={(event) =>
                  onFieldChange(
                    "numberOfBathrooms",
                    parseNumberInput(event.target.value),
                  )
                }
                required
                disabled={isLocked}
              />
              {errors.numberOfBathrooms && (
                <p className="text-red-500 text-sm">
                  {errors.numberOfBathrooms}
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
                value={values.frontage ?? ""}
                onChange={(event) =>
                  onFieldChange(
                    "frontage",
                    parseNumberInput(event.target.value),
                  )
                }
                disabled={isLocked}
              />
              {errors.frontage && (
                <p className="text-red-500 text-sm">{errors.frontage}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Diện tích lối vào
              </label>
              <Input
                type="number"
                placeholder="m²"
                value={values.entryWidth ?? ""}
                onChange={(event) =>
                  onFieldChange(
                    "entryWidth",
                    parseNumberInput(event.target.value),
                  )
                }
                disabled={isLocked}
              />
              {errors.entryWidth && (
                <p className="text-red-500 text-sm">{errors.entryWidth}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Hướng nhà
              </label>
              <Input
                placeholder="Hướng nhà"
                value={values.direction}
                onChange={(event) =>
                  onFieldChange("direction", event.target.value)
                }
                disabled={isLocked}
              />
              {errors.direction && (
                <p className="text-red-500 text-sm">{errors.direction}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Số tầng
              </label>
              <Input
                type="number"
                placeholder="0"
                value={values.floorNumber ?? ""}
                onChange={(event) =>
                  onFieldChange(
                    "floorNumber",
                    parseNumberInput(event.target.value),
                  )
                }
                disabled={isLocked}
              />
              {errors.floorNumber && (
                <p className="text-red-500 text-sm">{errors.floorNumber}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
