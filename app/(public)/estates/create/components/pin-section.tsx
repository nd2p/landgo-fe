import { useMemo, useState } from "react";
import type {
  EstateFormErrors,
  EstateFormState,
  FieldChangeHandler,
} from "@/features/estate/estate.form";

type Props = {
  values: EstateFormState;
  errors: EstateFormErrors;
  onFieldChange: FieldChangeHandler;
};

export default function PinSection({ values, errors, onFieldChange }: Props) {
  const [selectedDays, setSelectedDays] = useState(0);
  const isPinned = values.isPinned;
  const pinLevel = values.pinLevel;

  const dailyPrice = useMemo(() => {
    if (pinLevel === 1) return 30000;
    if (pinLevel === 2) return 50000;
    return 0;
  }, [pinLevel]);

  const durationDays = selectedDays;

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
                setSelectedDays(0);
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
                <option value="1">VIP - 30.000 VND / ngày</option>
                <option value="2">SUPPER - 50.000 VND / ngày</option>
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
                value={selectedDays ? String(selectedDays) : ""}
                onChange={(event) => {
                  const days = Number(event.target.value);
                  if (!days) {
                    onFieldChange("pinExpiredAt", null);
                    setSelectedDays(0);
                    return;
                  }
                  setSelectedDays(days);
                  const end = new Date();
                  end.setDate(end.getDate() + days);
                  onFieldChange("pinExpiredAt", end.toISOString());
                }}
              >
                <option value="">Chọn số ngày</option>
                <option value="3">3 ngay</option>
                <option value="7">7 ngay</option>
                <option value="14">14 ngay</option>
                <option value="30">30 ngay</option>
              </select>
              {errors.pinExpiredAt && (
                <p className="text-red-500 text-sm">{errors.pinExpiredAt}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-700">
            <span>Tổng chi phí</span>
            <span className="font-semibold text-slate-900">
              {dailyPrice && durationDays
                ? (dailyPrice * durationDays).toLocaleString("vi-VN") + " VND"
                : "0 VND"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
