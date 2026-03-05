import { CheckCircle, RotateCcw } from "lucide-react";
import type { Product } from "../data/catalog";
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

        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
          Anfrage eingereicht!
        </h2>
        <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>
          Wir melden uns innerhalb von 24 Stunden bei Ihnen.
        </p>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          Vorgangsnummer:{" "}
          <span className="text-indigo-400 font-bold">{orderId}</span>
        </p>

        {/* Summary */}
        <div className="text-left glass-card-sm p-6 mb-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Zusammenfassung</h3>
          <div className="space-y-2 mb-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="text-sm py-1.5"
              >
                <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 text-sm" style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            <p className="mb-1">
              {cart.length} Produkt{cart.length !== 1 ? "e" : ""} eingereicht
            </p>
            <p>
              Zahlungsmethode:{" "}
              <span style={{ color: 'var(--text-primary)' }}>
                {payment.method === "bank" ? "Banküberweisung" : "PayPal"}
              </span>
            </p>
            <p>
              Kontakt:{" "}
              <span style={{ color: 'var(--text-primary)' }}>
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
