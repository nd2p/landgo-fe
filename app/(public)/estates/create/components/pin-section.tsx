import { useMemo } from "react";
import type {
  EstateFormErrors,
  EstateFormState,
  FieldChangeHandler,
} from "@/features/estate/estate.form";
import { PaymentDurationType } from "@/features/estate/estate.types";

type Props = {
  values: EstateFormState;
  errors: EstateFormErrors;
  onFieldChange: FieldChangeHandler;
};

const DURATION_OPTIONS: Array<{
  value: PaymentDurationType;
  label: string;
  days: number;
}> = [
  { value: "week", label: "7 ngày (Tuần)", days: 7 },
  { value: "month", label: "30 ngày (Tháng)", days: 30 },
  { value: "year", label: "365 ngày (Năm)", days: 365 },
];

const PIN_PRICES: Record<number, Record<PaymentDurationType, number>> = {
  1: { week: 2000, month: 3000, year: 4000 },
  2: { week: 3000, month: 4000, year: 5000 },
};

export default function PinSection({ values, errors, onFieldChange }: Props) {
  const isPinned = values.isPinned;
  const pinLevel = values.pinLevel;
  const pinDurationType = values.pinDurationType;

  const amount = useMemo(() => {
    if (!pinLevel || !pinDurationType) return 0;
    return PIN_PRICES[pinLevel]?.[pinDurationType] ?? 0;
  }, [pinLevel, pinDurationType]);

  return (
    <section className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Hình thức đăng tin</h2>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="rounded-xl border border-amber-400 bg-amber-50 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              checked={!isPinned}
              onChange={() => {
                onFieldChange("isPinned", false);
                onFieldChange("pinLevel", null);
                onFieldChange("pinExpiredAt", null);
                onFieldChange("pinDurationType", "");
              }}
            />
            <span className="font-semibold text-slate-900">Tin thường</span>
          </div>
        </label>

        <div
          className={`rounded-xl border p-4 space-y-3 ${
            isPinned ? "border-red-400 bg-red-50/40" : "border-slate-200"
          }`}
        >
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={Boolean(isPinned)}
              onChange={() => {
                onFieldChange("isPinned", true);
              }}
            />
            <span className="font-semibold text-slate-900">Tin VIP</span>
          </label>

          <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Loại tin VIP
              </label>
              <select
                className="border-input w-full rounded-md border px-3 py-2 text-sm"
                disabled={!isPinned}
                value={pinLevel ? String(pinLevel) : ""}
                onChange={(event) => {
                  const nextValue = event.target.value
                    ? (Number(event.target.value) as 1 | 2)
                    : null;
                  onFieldChange("pinLevel", nextValue);
                }}
              >
                <option value="">Chọn Level</option>
                <option value="1">VIP</option>
                <option value="2">SUPPER</option>
              </select>
              {errors.pinLevel && (
                <p className="text-red-500 text-sm">{errors.pinLevel}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Số ngày
              </label>
              <select
                className="border-input w-full rounded-md border px-3 py-2 text-sm"
                disabled={!isPinned}
                value={pinDurationType ?? ""}
                onChange={(event) => {
                  const nextValue = event.target.value as PaymentDurationType;
                  if (!nextValue) {
                    onFieldChange("pinExpiredAt", null);
                    onFieldChange("pinDurationType", "");
                    return;
                  }
                  const selected = DURATION_OPTIONS.find(
                    (option) => option.value === nextValue,
                  );
                  if (!selected) return;
                  const end = new Date();
                  end.setDate(end.getDate() + selected.days);
                  onFieldChange("pinExpiredAt", end.toISOString());
                  onFieldChange("pinDurationType", nextValue);
                }}
              >
                <option value="">Chọn số ngày</option>
                {DURATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.pinExpiredAt && (
                <p className="text-red-500 text-sm">{errors.pinExpiredAt}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-700">
            <span>Tổng chi phí</span>
            <span className="font-semibold text-slate-900">
              {amount ? `${amount.toLocaleString("vi-VN")} VND` : "0 VND"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
