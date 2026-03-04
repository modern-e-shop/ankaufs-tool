import { useState, useCallback } from "react";
import type { Product } from "../data/catalog";

export interface CartItem extends Product {}

export interface PaymentInfo {
  method: "bank" | "paypal";
  iban?: string;
  accountHolder?: string;
  paypalEmail?: string;
  sellerName: string;
  sellerEmail: string;
}

export interface AppState {
  step: number;
  cart: CartItem[];
  condition: string;
  payment: PaymentInfo;
  orderId: string;
}

const initialPayment: PaymentInfo = {
  method: "bank",
  iban: "",
  accountHolder: "",
  paypalEmail: "",
  sellerName: "",
  sellerEmail: "",
};

export function useAppStore() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [condition, setCondition] = useState("");
  const [payment, setPayment] = useState<PaymentInfo>(initialPayment);
  const [orderId, setOrderId] = useState("");

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleProduct = useCallback((product: Product) => {
    setCart((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const isInCart = useCallback(
    (id: string) => cart.some((p) => p.id === id),
    [cart]
  );

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const generateOrderId = useCallback(() => {
    const id = "SA-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    setOrderId(id);
    return id;
  }, []);

  const reset = useCallback(() => {
    setStep(1);
    setCart([]);
    setCondition("");
    setPayment(initialPayment);
    setOrderId("");
  }, []);

  return {
    step,
    setStep,
    cart,
    addToCart,
    removeFromCart,
    toggleProduct,
    isInCart,
    total,
    condition,
    setCondition,
    payment,
    setPayment,
    orderId,
    generateOrderId,
    reset,
  };
}
