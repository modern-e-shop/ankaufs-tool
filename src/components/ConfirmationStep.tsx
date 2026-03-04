import { CheckCircle, RotateCcw } from "lucide-react";
import type { Product } from "../data/catalog";
import { formatPrice } from "../data/catalog";
import type { PaymentInfo } from "../store/useStore";
import Stepper from "./Stepper";

interface Props {
  cart: Product[];
  total: number;
  payment: PaymentInfo;
  orderId: string;
  onReset: () => void;
}

export default function ConfirmationStep({
  cart,
  total,
  payment,
  orderId,
  onReset,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto animate-in">
      <Stepper current={4} />
      <div className="glass-card p-8 text-center">
        {/* Check animation */}
        <div className="animate-check mb-6">
          <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Anfrage eingereicht!
        </h2>
        <p className="text-slate-400 mb-1">
          Wir melden uns innerhalb von 24 Stunden bei Ihnen.
        </p>
        <p className="text-sm text-slate-500 mb-8">
          Vorgangsnummer:{" "}
          <span className="font-mono text-indigo-400 font-bold">{orderId}</span>
        </p>

        {/* Summary */}
        <div className="text-left glass-card-sm p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Zusammenfassung</h3>
          <div className="space-y-2 mb-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm py-1.5"
              >
                <span className="text-slate-300">{item.name}</span>
                <span className="price">{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-700/50 pt-3 flex justify-between">
            <span className="text-white font-semibold">Gesamtbetrag</span>
            <span className="price text-xl">{formatPrice(total)}</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50 text-sm text-slate-400">
            <p>
              Zahlungsmethode:{" "}
              <span className="text-slate-200">
                {payment.method === "bank" ? "Banküberweisung" : "PayPal"}
              </span>
            </p>
            <p>
              Kontakt:{" "}
              <span className="text-slate-200">
                {payment.sellerName} ({payment.sellerEmail})
              </span>
            </p>
          </div>
        </div>

        <button onClick={onReset} className="btn-secondary">
          <RotateCcw className="w-4 h-4" />
          Neuen Ankauf starten
        </button>
      </div>
    </div>
  );
}
