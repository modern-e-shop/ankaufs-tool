import skylanderImages from "./skylander-images.json";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  condition?: "gut" | "teil_abgebrochen";
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

/** Normalize a product name to match image keys */
function normalizeKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Find the best matching image URL for a product name */
function findImage(name: string): string | null {
  const images = skylanderImages as Record<string, string>;
  const key = normalizeKey(name);

  // Direct match
  if (images[key]) return images[key];

  // Try "figur-{key}" (common pattern in the shop)
  if (images[`figur-${key}`]) return images[`figur-${key}`];

  // Fuzzy: find any key that ends with the normalized name
  for (const [k, url] of Object.entries(images)) {
    if (k.endsWith(`-${key}`) || k.endsWith(key)) return url;
  }

  // Fuzzy: find any key that contains the normalized name
  for (const [k, url] of Object.entries(images)) {
    if (k.includes(key)) return url;
  }

  return null;
}

export const CATALOG: Catalog = {
  skylanders: {
    name: "Skylanders",
    icon: "🎮",
    subcategories: {
      spyros_adventure: {
        name: "Spyro's Adventure",
        products: [
          { id: "sky-001", name: "Spyro", price: 8.50, image: findImage("Spyro") },
          { id: "sky-002", name: "Trigger Happy", price: 5.00, image: findImage("Trigger Happy") },
          { id: "sky-003", name: "Gill Grunt", price: 4.50, image: findImage("Gill Grunt") },
          { id: "sky-004", name: "Stealth Elf", price: 6.00, image: findImage("Stealth Elf") },
          { id: "sky-005", name: "Eruptor", price: 5.50, image: findImage("Eruptor") },
        ],
      },
      giants: {
        name: "Giants",
        products: [
          { id: "sky-010", name: "Tree Rex", price: 12.00, image: findImage("Tree Rex") },
          { id: "sky-011", name: "Crusher", price: 10.00, image: findImage("Crusher") },
          { id: "sky-012", name: "Bouncer", price: 11.00, image: findImage("Bouncer") },
          { id: "sky-013", name: "Hot Head", price: 9.50, image: findImage("Hot Head") },
        ],
      },
      swap_force: {
        name: "Swap Force",
        products: [
          { id: "sky-020", name: "Magna Charge", price: 7.00, image: findImage("Magna Charge") },
          { id: "sky-021", name: "Wash Buckler", price: 8.00, image: findImage("Wash Buckler") },
          { id: "sky-022", name: "Blast Zone", price: 6.50, image: findImage("Blast Zone") },
          { id: "sky-023", name: "Night Shift", price: 7.50, image: findImage("Night Shift") },
        ],
      },
      trap_team: {
        name: "Trap Team",
        products: [
          { id: "sky-030", name: "Snap Shot", price: 6.00, image: findImage("Snap Shot") },
          { id: "sky-031", name: "Food Fight", price: 4.00, image: findImage("Food Fight") },
          { id: "sky-032", name: "Wallop", price: 5.50, image: findImage("Wallop") },
        ],
      },
      superchargers: {
        name: "SuperChargers",
        products: [
          { id: "sky-040", name: "Spitfire", price: 7.00, image: findImage("Spitfire") },
          { id: "sky-041", name: "Stormblade", price: 6.00, image: findImage("Stormblade") },
        ],
      },
      imaginators: {
        name: "Imaginators",
        products: [
          { id: "sky-050", name: "King Pen", price: 8.00, image: findImage("King Pen") },
          { id: "sky-051", name: "Golden Queen", price: 9.00, image: findImage("Golden Queen") },
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
