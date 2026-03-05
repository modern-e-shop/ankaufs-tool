import { useState, useCallback } from "react";
import type { Product } from "../data/catalog";

export type ProductCondition = "gut" | "teil_abgebrochen";

export interface CartItem extends Product {
  condition: ProductCondition;
  adjustedPrice: number;
}

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

export function calculateAdjustedPrice(
  price: number,
  condition: ProductCondition
): number {
  if (condition === "teil_abgebrochen") {
    return Math.floor(price * 0.3 * 10) / 10;
  }
  return price;
}

export function useAppStore() {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [condition, setCondition] = useState("");
  const [payment, setPayment] = useState<PaymentInfo>(initialPayment);
  const [orderId, setOrderId] = useState("");

  const addToCart = useCallback(
    (product: Product, productCondition: ProductCondition = "gut") => {
      setCart((prev) => {
        if (prev.find((p) => p.id === product.id)) return prev;
        const adjustedPrice = calculateAdjustedPrice(
          product.price,
          productCondition
        );
        return [
          ...prev,
          { ...product, condition: productCondition, adjustedPrice },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateCartItemCondition = useCallback(
    (id: string, productCondition: ProductCondition) => {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                condition: productCondition,
                adjustedPrice: calculateAdjustedPrice(
                  item.price,
                  productCondition
                ),
              }
            : item
        )
      );
    },
    []
  );

  const toggleProduct = useCallback(
    (product: Product, productCondition: ProductCondition = "gut") => {
      setCart((prev) => {
        if (prev.find((p) => p.id === product.id)) {
          return prev.filter((p) => p.id !== product.id);
        }
        const adjustedPrice = calculateAdjustedPrice(
          product.price,
          productCondition
        );
        return [
          ...prev,
          { ...product, condition: productCondition, adjustedPrice },
        ];
      });
    },
    []
  );

  const isInCart = useCallback(
    (id: string) => cart.some((p) => p.id === id),
    [cart]
  );

  const total = cart.reduce((sum, item) => sum + item.adjustedPrice, 0);

  const generateOrderId = useCallback(() => {
    const id =
      "SA-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      Math.random().toString(36).substring(2, 6).toUpperCase();
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
    updateCartItemCondition,
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
