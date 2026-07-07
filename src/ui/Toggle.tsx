import { useState } from "react";

/** Toggle demonstrativo — muda visualmente, sem persistência. */
export function Toggle({ defaultOn = false, onChange }: { defaultOn?: boolean; onChange?: (v: boolean) => void }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => {
          setOn(e.target.checked);
          onChange?.(e.target.checked);
        }}
      />
      <span className="slider" />
    </label>
  );
}
