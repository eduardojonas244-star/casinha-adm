import { useState } from "react";

/** Toggle demonstrativo — muda visualmente, sem persistência. */
export function Toggle({
  defaultOn = false,
  checked,
  onChange,
}: {
  defaultOn?: boolean;
  checked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [internal, setInternal] = useState(defaultOn);
  const on = checked !== undefined ? checked : internal;
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => {
          if (checked === undefined) setInternal(e.target.checked);
          onChange?.(e.target.checked);
        }}
      />
      <span className="slider" />
    </label>
  );
}
