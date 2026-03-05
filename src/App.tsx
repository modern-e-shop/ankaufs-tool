import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Header from "./components/Header";
import Stepper from "./components/Stepper";
import ProductSelection from "./components/ProductSelection";
import ConditionStep from "./components/ConditionStep";
import CartStep from "./components/CartStep";
import PaymentStep from "./components/PaymentStep";
import ConfirmationStep from "./components/ConfirmationStep";
import { useAppStore } from "./store/useStore";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminProducts from "./pages/admin/AdminProducts";

function PublicPortal() {
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
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--toast-bg)",
            border: "1px solid var(--toast-border)",
            color: "var(--text-primary)",
            backdropFilter: "blur(12px)",
          },
        }}
      />

      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Portal */}
        <Route path="/" element={<PublicPortal />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
