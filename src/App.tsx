import { useState } from "react";
import { Toaster, toast } from "sonner";
import Header from "./components/Header";
import Stepper from "./components/Stepper";
import ProductSelection from "./components/ProductSelection";
import ConditionStep from "./components/ConditionStep";
import CartStep from "./components/CartStep";
import PaymentStep from "./components/PaymentStep";
import ConfirmationStep from "./components/ConfirmationStep";
import { useAppStore } from "./store/useStore";

export default function App() {
  const store = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleNext = () => {
    if (store.step === 1 && store.cart.length === 0) {
      toast.error("Bitte wählen Sie mindestens ein Produkt aus.");
      return;
    }
    store.setStep(store.step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    store.setStep(store.step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    store.generateOrderId();
    store.setStep(5);
    toast.success("Ankauf erfolgreich eingereicht!");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    store.reset();
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen px-4 md:px-8 pb-24 max-w-7xl mx-auto">
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(17, 17, 40, 0.9)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            color: "#e2e8f0",
            backdropFilter: "blur(12px)",
          },
        }}
      />

      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Show stepper for steps 2-4 (not on step 1 product selection, not on step 5 confirmation which has its own) */}
      {store.step >= 2 && store.step <= 3 && <Stepper current={store.step} />}

      {store.step === 1 && (
        <ProductSelection
          searchQuery={searchQuery}
          cart={store.cart}
          toggleProduct={store.toggleProduct}
          isInCart={store.isInCart}
          total={store.total}
          onNext={handleNext}
        />
      )}

      {store.step === 2 && (
        <ConditionStep
          condition={store.condition}
          setCondition={store.setCondition}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {store.step === 3 && (
        <CartStep
          cart={store.cart}
          total={store.total}
          removeFromCart={store.removeFromCart}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}

      {store.step === 4 && (
        <PaymentStep
          payment={store.payment}
          setPayment={store.setPayment}
          onBack={handleBack}
          onSubmit={handleSubmit}
        />
      )}

      {store.step === 5 && (
        <ConfirmationStep
          cart={store.cart}
          total={store.total}
          payment={store.payment}
          orderId={store.orderId}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
