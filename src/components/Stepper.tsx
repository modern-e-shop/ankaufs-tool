import { Check } from "lucide-react";

const STEPS = [
  { num: 1, label: "Produkte" },
  { num: 2, label: "Warenkorb" },
  { num: 3, label: "Zahlung" },
  { num: 4, label: "Bestätigung" },
];

interface StepperProps {
  current: number;
}

export default function Stepper({ current }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 py-6">
      {STEPS.map((s, i) => {
        const done = current > s.num;
        const active = current === s.num;
        return (
          <div key={s.num} className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  done
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : active
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500 shadow-[0_0_16px_rgba(99,102,241,0.3)]"
                    : "border"
                }`}
                style={
                  !done && !active
                    ? { background: 'var(--input-bg)', color: 'var(--text-muted)', borderColor: 'var(--border-color)' }
                    : undefined
                }
              >
                {done ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={`text-sm font-medium hidden sm:inline transition-colors ${
                  done
                    ? "text-emerald-400"
                    : active
                    ? ""
                    : ""
                }`}
                style={
                  active
                    ? { color: 'var(--text-heading)' }
                    : !done
                    ? { color: 'var(--text-muted)' }
                    : undefined
                }
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 md:w-16 h-px transition-colors ${
                  done ? "bg-emerald-500/40" : ""
                }`}
                style={!done ? { background: 'var(--border-color)' } : undefined}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
