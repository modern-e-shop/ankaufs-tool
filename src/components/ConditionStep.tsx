import { ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  condition: string;
  setCondition: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function ConditionStep({
  condition,
  setCondition,
  onBack,
  onNext,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto animate-in">
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Zustandsbeschreibung
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          Optional — beschreiben Sie den Zustand Ihrer Produkte.
        </p>
        <textarea
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          rows={5}
          placeholder="z.B. leichte Kratzer, Originalverpackung vorhanden, voll funktionsfähig..."
          className="w-full p-4 rounded-xl bg-slate-800/50 border border-[rgba(99,102,241,0.15)] text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 resize-none transition-all duration-200"
        />
        <div className="flex justify-between mt-6">
          <button onClick={onBack} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </button>
          <button onClick={onNext} className="btn-primary">
            Weiter
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
