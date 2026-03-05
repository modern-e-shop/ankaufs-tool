import { X, ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "../data/catalog";
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
  removeFromCart,
  onBack,
  onNext,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto animate-in">
      <Stepper current={2} />
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-heading)' }}>Warenkorb</h2>
        {cart.length === 0 ? (
          <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
            Keine Produkte im Warenkorb.
          </p>
        ) : (
          <>
            <p className="text-sm mb-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
              {cart.length} Produkt{cart.length !== 1 ? "e" : ""} ausgewählt
            </p>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-200"
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color-light)',
                  }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl">
                      {item.id.startsWith("sky") ? "🎮" : "📷"}
                    </span>
                    <span className="font-medium truncate" style={{ color: 'var(--text-heading)' }}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
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
