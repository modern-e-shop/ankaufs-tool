import { ArrowLeft, Send } from "lucide-react";
import type { PaymentInfo } from "../store/useStore";
import Stepper from "./Stepper";

interface Props {
  payment: PaymentInfo;
  setPayment: (p: PaymentInfo) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function PaymentStep({
  payment,
  setPayment,
  onBack,
  onSubmit,
}: Props) {
  const update = (fields: Partial<PaymentInfo>) =>
    setPayment({ ...payment, ...fields });

  const isValid =
    payment.sellerName.trim() !== "" &&
    payment.sellerEmail.trim() !== "" &&
    (payment.method === "bank"
      ? (payment.iban?.trim() || "") !== "" &&
        (payment.accountHolder?.trim() || "") !== ""
      : (payment.paypalEmail?.trim() || "") !== "");

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <Stepper current={3} />
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Zahlungsinformationen
        </h2>

        {/* Payment method */}
        <div className="mb-6">
          <label className="text-sm text-slate-400 mb-3 block">
            Zahlungsmethode
          </label>
          <div className="flex gap-4">
            {(["bank", "paypal"] as const).map((m) => (
              <label
                key={m}
                className={`flex-1 glass-card-sm p-4 cursor-pointer transition-all duration-200 text-center ${
                  payment.method === m
                    ? "!border-indigo-500 !bg-indigo-500/10"
                    : "hover:border-slate-600"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={m}
                  checked={payment.method === m}
                  onChange={() => update({ method: m })}
                  className="sr-only"
                />
                <span className="text-2xl block mb-1">
                  {m === "bank" ? "🏦" : "💳"}
                </span>
                <span className="text-sm font-medium text-white">
                  {m === "bank" ? "Banküberweisung" : "PayPal"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Bank fields */}
        {payment.method === "bank" && (
          <div className="space-y-4 mb-6 animate-in">
            <InputField
              label="IBAN *"
              value={payment.iban || ""}
              onChange={(v) => update({ iban: v })}
              placeholder="DE89 3704 0044 0532 0130 00"
            />
            <InputField
              label="Kontoinhaber *"
              value={payment.accountHolder || ""}
              onChange={(v) => update({ accountHolder: v })}
              placeholder="Max Mustermann"
            />
          </div>
        )}

        {/* PayPal fields */}
        {payment.method === "paypal" && (
          <div className="mb-6 animate-in">
            <InputField
              label="PayPal E-Mail-Adresse *"
              value={payment.paypalEmail || ""}
              onChange={(v) => update({ paypalEmail: v })}
              placeholder="max@beispiel.de"
              type="email"
            />
          </div>
        )}

        {/* Seller info */}
        <div className="border-t border-slate-700/50 pt-6 space-y-4 mb-6">
          <h3 className="text-white font-semibold">Ihre Kontaktdaten</h3>
          <InputField
            label="Name *"
            value={payment.sellerName}
            onChange={(v) => update({ sellerName: v })}
            placeholder="Ihr vollständiger Name"
          />
          <InputField
            label="E-Mail *"
            value={payment.sellerEmail}
            onChange={(v) => update({ sellerEmail: v })}
            placeholder="ihre@email.de"
            type="email"
          />
        </div>

        <div className="flex justify-between">
          <button onClick={onBack} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </button>
          <button
            onClick={onSubmit}
            disabled={!isValid}
            className="btn-primary"
          >
            <Send className="w-4 h-4" />
            Ankauf absenden
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm text-slate-400 mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-[rgba(99,102,241,0.15)] text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200"
      />
    </div>
  );
}
