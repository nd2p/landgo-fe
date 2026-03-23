import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  min,
  onChange,
  onBlur,
  onKeyDown,
  ...props
}: React.ComponentProps<"input">) {
  const isChoiceInput = type === "checkbox" || type === "radio";
  const isNumberInput = type === "number";

  const normalizeNumberValue = (rawValue: string) => {
    const trimmed = rawValue.trim();

    if (!trimmed) {
      return "0";
    }

    if (
      trimmed.includes("-") ||
      trimmed.includes("+") ||
      trimmed.toLowerCase().includes("e")
    ) {
      return "0";
    }

    return trimmed;
  };

  return (
    <input
      type={type}
      data-slot="input"
      min={isNumberInput ? (min ?? 0) : min}
      className={cn(
        isChoiceInput
          ? "h-4 w-4 cursor-pointer accent-blue-600"
          : "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        className,
      )}
      onKeyDown={(event) => {
        if (
          isNumberInput &&
          (event.key === "-" ||
            event.key === "+" ||
            event.key === "e" ||
            event.key === "E")
        ) {
          event.preventDefault();
          return;
        }
        onKeyDown?.(event);
      }}
      onChange={(event) => {
        if (isNumberInput) {
          const normalized = normalizeNumberValue(event.target.value);
          if (normalized !== event.target.value) {
            event.target.value = normalized;
          }
        }
        onChange?.(event);
      }}
      onBlur={(event) => {
        if (isNumberInput) {
          const normalized = normalizeNumberValue(event.target.value);
          if (normalized !== event.target.value) {
            event.target.value = normalized;
          }
        }
        onBlur?.(event);
      }}
      {...props}
    />
  );
}

export { Input };
