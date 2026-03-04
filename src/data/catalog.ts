export interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
}

export interface Subcategory {
  name: string;
  products: Product[];
}

export interface Category {
  name: string;
  icon: string;
  subcategories: Record<string, Subcategory>;
}

export type Catalog = Record<string, Category>;

export const CATALOG: Catalog = {
  skylanders: {
    name: "Skylanders",
    icon: "🎮",
    subcategories: {
      spyros_adventure: {
        name: "Spyro's Adventure",
        products: [
          { id: "sky-001", name: "Spyro", price: 8.50, image: null },
          { id: "sky-002", name: "Trigger Happy", price: 5.00, image: null },
          { id: "sky-003", name: "Gill Grunt", price: 4.50, image: null },
          { id: "sky-004", name: "Stealth Elf", price: 6.00, image: null },
          { id: "sky-005", name: "Eruptor", price: 5.50, image: null },
        ],
      },
      giants: {
        name: "Giants",
        products: [
          { id: "sky-010", name: "Tree Rex", price: 12.00, image: null },
          { id: "sky-011", name: "Crusher", price: 10.00, image: null },
          { id: "sky-012", name: "Bouncer", price: 11.00, image: null },
          { id: "sky-013", name: "Hot Head", price: 9.50, image: null },
        ],
      },
      swap_force: {
        name: "Swap Force",
        products: [
          { id: "sky-020", name: "Magna Charge", price: 7.00, image: null },
          { id: "sky-021", name: "Wash Buckler", price: 8.00, image: null },
          { id: "sky-022", name: "Blast Zone", price: 6.50, image: null },
          { id: "sky-023", name: "Night Shift", price: 7.50, image: null },
        ],
      },
      trap_team: {
        name: "Trap Team",
        products: [
          { id: "sky-030", name: "Snap Shot", price: 6.00, image: null },
          { id: "sky-031", name: "Food Fight", price: 4.00, image: null },
          { id: "sky-032", name: "Wallop", price: 5.50, image: null },
        ],
      },
      superchargers: {
        name: "SuperChargers",
        products: [
          { id: "sky-040", name: "Spitfire", price: 7.00, image: null },
          { id: "sky-041", name: "Stormblade", price: 6.00, image: null },
        ],
      },
      imaginators: {
        name: "Imaginators",
        products: [
          { id: "sky-050", name: "King Pen", price: 8.00, image: null },
          { id: "sky-051", name: "Golden Queen", price: 9.00, image: null },
        ],
      },
    },
  },
  kameras: {
    name: "Kameras",
    icon: "📷",
    subcategories: {
      klappkameras: {
        name: "Klappkameras",
        products: [
          { id: "cam-001", name: "Olympus mju II", price: 85.00, image: null },
          { id: "cam-002", name: "Contax T2", price: 450.00, image: null },
          { id: "cam-003", name: "Ricoh GR1", price: 280.00, image: null },
        ],
      },
      spiegelreflex: {
        name: "Spiegelreflexkameras",
        products: [
          { id: "cam-010", name: "Canon AE-1", price: 120.00, image: null },
          { id: "cam-011", name: "Nikon FM2", price: 180.00, image: null },
          { id: "cam-012", name: "Pentax K1000", price: 95.00, image: null },
        ],
      },
      sofortbild: {
        name: "Sofortbildkameras",
        products: [
          { id: "cam-020", name: "Polaroid SX-70", price: 150.00, image: null },
          { id: "cam-021", name: "Instax Mini 90", price: 60.00, image: null },
        ],
      },
    },
  },
};

export function getAllProducts(): Product[] {
  const products: Product[] = [];
  for (const cat of Object.values(CATALOG)) {
    for (const sub of Object.values(cat.subcategories)) {
      products.push(...sub.products);
    }
  }
  return products;
}

export function formatPrice(price: number): string {
  return price.toFixed(2).replace(".", ",") + " €";
}
