import { useState, useMemo } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { CATALOG, getAllProducts, formatPrice } from "../data/catalog";
import type { Product } from "../data/catalog";
import type { CartItem, ProductCondition } from "../store/useStore";
import { calculateAdjustedPrice } from "../store/useStore";

interface Props {
  searchQuery: string;
  cart: CartItem[];
  toggleProduct: (p: Product, condition?: ProductCondition) => void;
  isInCart: (id: string) => boolean;
  total: number;
  onNext: () => void;
}

function ProductThumbnail({ product }: { product: Product }) {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        loading="lazy"
      />
    );
  }
  // Fallback: first letter in colored circle
  const colors = [
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-violet-500",
  ];
  const colorIndex =
    product.name.charCodeAt(0) % colors.length;
  return (
    <div
      className={`w-12 h-12 rounded-lg ${colors[colorIndex]} flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-white font-bold text-lg">
        {product.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function ConditionSelector({
  product,
  onSelect,
  onCancel,
}: {
  product: Product;
  onSelect: (condition: ProductCondition) => void;
  onCancel: () => void;
}) {
  const gutPrice = product.price;
  const brokenPrice = calculateAdjustedPrice(product.price, "teil_abgebrochen");

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 p-3 rounded-xl backdrop-blur-sm"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <p
        className="text-xs font-semibold mb-1"
        style={{ color: "var(--text-heading)" }}
      >
        Zustand wählen
      </p>
      <button
        onClick={() => onSelect("gut")}
        className="w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
      >
        ✅ Gut — {formatPrice(gutPrice)}
      </button>
      <button
        onClick={() => onSelect("teil_abgebrochen")}
        className="w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30"
      >
        ⚠️ Teil abgebrochen — {formatPrice(brokenPrice)}
      </button>
      <button
        onClick={onCancel}
        className="text-xs mt-1 hover:underline"
        style={{ color: "var(--text-muted)" }}
      >
        Abbrechen
      </button>
    </div>
  );
}

export default function ProductSelection({
  searchQuery,
  cart,
  toggleProduct,
  isInCart,
  onNext,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(
    Object.keys(CATALOG)[0]
  );
  const [activeSubcategory, setActiveSubcategory] = useState<string>(
    Object.keys(CATALOG[Object.keys(CATALOG)[0]].subcategories)[0]
  );
  const [selectingCondition, setSelectingCondition] = useState<string | null>(
    null
  );

  const categories = Object.entries(CATALOG);
  const currentCat = CATALOG[activeCategory];
  const subcategories = currentCat
    ? Object.entries(currentCat.subcategories)
    : [];

  // Filter by search
  const allProducts = useMemo(() => getAllProducts(), []);
  const isSearching = searchQuery.trim().length > 0;

  const filteredProducts = useMemo(() => {
    if (!isSearching) {
      return currentCat?.subcategories[activeSubcategory]?.products || [];
    }
    const q = searchQuery.toLowerCase();
    return allProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [searchQuery, isSearching, currentCat, activeSubcategory, allProducts]);

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    const firstSub = Object.keys(CATALOG[key].subcategories)[0];
    setActiveSubcategory(firstSub);
  };

  const handleProductClick = (product: Product) => {
    if (isInCart(product.id)) {
      // Remove from cart
      toggleProduct(product);
      setSelectingCondition(null);
    } else {
      // Show condition selector
      setSelectingCondition(product.id);
    }
  };

  const handleConditionSelect = (
    product: Product,
    condition: ProductCondition
  ) => {
    toggleProduct(product, condition);
    setSelectingCondition(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1 lg:w-[65%]">
        {/* Category cards */}
        {!isSearching && (
          <>
            <div className="flex gap-4 mb-6 flex-wrap">
              {categories.map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => handleCategoryChange(key)}
                  className={`glass-card-sm px-6 py-4 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:border-indigo-500/50 ${
                    activeCategory === key
                      ? "!border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                      : ""
                  }`}
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Subcategory chips */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {subcategories.map(([key, sub]) => (
                <button
                  key={key}
                  onClick={() => setActiveSubcategory(key)}
                  className={`chip ${activeSubcategory === key ? "active" : ""}`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </>
        )}

        {isSearching && (
          <p
            className="mb-4 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {filteredProducts.length} Ergebnis
            {filteredProducts.length !== 1 ? "se" : ""} für „{searchQuery}"
          </p>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product, i) => {
            const selected = isInCart(product.id);
            const showConditionSelector = selectingCondition === product.id;
            return (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`glass-card-sm p-4 text-left cursor-pointer transition-all duration-200 hover:border-indigo-500/40 animate-in relative ${
                  selected
                    ? "!border-emerald-500/50 !bg-emerald-500/5"
                    : ""
                }`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {showConditionSelector && (
                  <ConditionSelector
                    product={product}
                    onSelect={(c) => handleConditionSelect(product, c)}
                    onCancel={() => setSelectingCondition(null)}
                  />
                )}
                {/* Image area */}
                <div
                  className="w-full aspect-square rounded-lg flex items-center justify-center mb-3 relative overflow-hidden"
                  style={{ background: "var(--input-bg)" }}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-4xl opacity-30">
                      {product.id.startsWith("sky") ? "🎮" : "📷"}
                    </span>
                  )}
                  {selected && (
                    <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-8 h-8 text-emerald-400" />
                    </div>
                  )}
                </div>
                <p
                  className="font-medium text-sm truncate"
                  style={{ color: "var(--text-heading)" }}
                >
                  {product.name}
                </p>
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div
            className="text-center py-16"
            style={{ color: "var(--text-muted)" }}
          >
            Keine Produkte gefunden.
          </div>
        )}
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block lg:w-[35%]">
        <div className="glass-card p-6 sticky top-6">
          <SidebarContent cart={cart} onNext={onNext} />
        </div>
      </div>

      {/* Mobile floating badge */}
      {cart.length > 0 && (
        <button
          onClick={onNext}
          className="lg:hidden fixed bottom-6 right-6 z-50 btn-primary rounded-full w-16 h-16 p-0 shadow-lg shadow-indigo-500/30"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {cart.length}
            </span>
          </div>
        </button>
      )}

      {/* Tablet sidebar below */}
      <div className="block lg:hidden">
        {cart.length > 0 && (
          <div className="glass-card p-6">
            <SidebarContent cart={cart} onNext={onNext} />
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarContent({
  cart,
  onNext,
}: {
  cart: CartItem[];
  onNext: () => void;
}) {
  return (
    <>
      <h3
        className="font-semibold text-lg mb-4 flex items-center gap-2"
        style={{ color: "var(--text-heading)" }}
      >
        <ShoppingCart className="w-5 h-5 text-indigo-400" />
        Ausgewählte Produkte
      </h3>
      {cart.length === 0 ? (
        <p
          className="text-sm py-8 text-center"
          style={{ color: "var(--text-muted)" }}
        >
          Noch keine Produkte ausgewählt
        </p>
      ) : (
        <>
          <p
            className="text-sm mb-4 font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {cart.length} Produkt{cart.length !== 1 ? "e" : ""} ausgewählt
          </p>
          <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 py-2 px-3 rounded-lg"
                style={{ background: "var(--input-bg)" }}
              >
                <ProductThumbnail product={item} />
                <div className="flex-1 min-w-0">
                  <span
                    className="text-sm truncate block"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.name}
                  </span>
                  {item.condition === "teil_abgebrochen" && (
                    <span className="text-xs text-amber-400">
                      ⚠️ Teil abgebrochen
                    </span>
                  )}
                </div>
                <span
                  className="text-sm font-medium flex-shrink-0"
                  style={{ color: "var(--text-heading)" }}
                >
                  {formatPrice(item.adjustedPrice)}
                </span>
              </div>
            ))}
          </div>
          <div
            className="pt-4 mt-4"
            style={{ borderTop: "1px solid var(--border-color)" }}
          >
            <p
              className="text-sm mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Auszahlung nach Eingang und Prüfung
            </p>
            <button onClick={onNext} className="btn-primary w-full">
              Weiter zum Warenkorb
            </button>
          </div>
        </>
      )}
    </>
  );
}
