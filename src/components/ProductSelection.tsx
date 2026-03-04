import { useState, useMemo } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { CATALOG, formatPrice, getAllProducts } from "../data/catalog";
import type { Product } from "../data/catalog";

interface Props {
  searchQuery: string;
  cart: Product[];
  toggleProduct: (p: Product) => void;
  isInCart: (id: string) => boolean;
  total: number;
  onNext: () => void;
}

export default function ProductSelection({
  searchQuery,
  cart,
  toggleProduct,
  isInCart,
  total,
  onNext,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(
    Object.keys(CATALOG)[0]
  );
  const [activeSubcategory, setActiveSubcategory] = useState<string>(
    Object.keys(CATALOG[Object.keys(CATALOG)[0]].subcategories)[0]
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
                  <span className="font-semibold text-white">{cat.name}</span>
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
          <p className="text-slate-400 mb-4 text-sm">
            {filteredProducts.length} Ergebnis
            {filteredProducts.length !== 1 ? "se" : ""} für „{searchQuery}"
          </p>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product, i) => {
            const selected = isInCart(product.id);
            return (
              <button
                key={product.id}
                onClick={() => toggleProduct(product)}
                className={`glass-card-sm p-4 text-left cursor-pointer transition-all duration-200 hover:border-indigo-500/40 animate-in ${
                  selected
                    ? "!border-emerald-500/50 !bg-emerald-500/5"
                    : ""
                }`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {/* Placeholder icon area */}
                <div className="w-full aspect-square rounded-lg bg-slate-800/50 flex items-center justify-center mb-3 relative overflow-hidden">
                  <span className="text-4xl opacity-30">
                    {product.id.startsWith("sky") ? "🎮" : "📷"}
                  </span>
                  {selected && (
                    <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-8 h-8 text-emerald-400" />
                    </div>
                  )}
                </div>
                <p className="font-medium text-white text-sm truncate">
                  {product.name}
                </p>
                <p className="price text-sm mt-1">{formatPrice(product.price)}</p>
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            Keine Produkte gefunden.
          </div>
        )}
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block lg:w-[35%]">
        <div className="glass-card p-6 sticky top-6">
          <SidebarContent
            cart={cart}
            total={total}
            onNext={onNext}
            toggleProduct={toggleProduct}
          />
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
            <SidebarContent
              cart={cart}
              total={total}
              onNext={onNext}
              toggleProduct={toggleProduct}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarContent({
  cart,
  total,
  onNext,
}: {
  cart: Product[];
  total: number;
  onNext: () => void;
  toggleProduct: (p: Product) => void;
}) {
  return (
    <>
      <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-indigo-400" />
        Ausgewählte Produkte
      </h3>
      {cart.length === 0 ? (
        <p className="text-slate-500 text-sm py-8 text-center">
          Noch keine Produkte ausgewählt
        </p>
      ) : (
        <>
          <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/30"
              >
                <span className="text-sm text-slate-200 truncate flex-1 mr-2">
                  {item.name}
                </span>
                <span className="price text-sm whitespace-nowrap">
                  {formatPrice(item.price)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-700/50 pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-300 font-medium">Gesamt</span>
              <span className="price text-2xl">{formatPrice(total)}</span>
            </div>
            <button onClick={onNext} className="btn-primary w-full">
              Weiter zum Warenkorb
            </button>
          </div>
        </>
      )}
    </>
  );
}
