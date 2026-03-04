import { X, ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "../data/catalog";
import { formatPrice } from "../data/catalog";
import Stepper from "./Stepper";

interface Props {
  cart: Product[];
  total: number;
  removeFromCart: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function CartStep({
  cart,
  total,
  removeFromCart,
  onBack,
  onNext,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto animate-in">
      <Stepper current={2} />
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Warenkorb</h2>
        {cart.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            Keine Produkte im Warenkorb.
          </p>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-800/30 border border-slate-700/30 transition-all duration-200 hover:border-slate-600/50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl">
                      {item.id.startsWith("sky") ? "🎮" : "📷"}
                    </span>
                    <span className="text-white font-medium truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="price text-sm">
                      {formatPrice(item.price)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-700/50 pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-slate-300 font-medium">
                  Gesamtbetrag
                </span>
                <span className="price text-3xl">{formatPrice(total)}</span>
              </div>
            </div>
          </>
        )}
        <div className="flex justify-between">
          <button onClick={onBack} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </button>
          <button
            onClick={onNext}
            disabled={cart.length === 0}
            className="btn-primary"
          >
            Weiter zur Zahlung
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
