#!/usr/bin/env node
/**
 * Fetches Skylanders product images from easybuy-shop.de Shopify API.
 * Saves normalized name → image URL mapping to src/data/skylander-images.json
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://easybuy-shop.de/collections/skylanders/products.json";
const OUTPUT = resolve(__dirname, "../src/data/skylander-images.json");

function normalize(title) {
  // Remove "Skylanders [Series] " prefix, then normalize
  let name = title
    .replace(/^Skylanders\s+(Spyro's Adventure|Giants|Swap Force|Trap Team|SuperChargers|Imaginators)\s+/i, "")
    .trim();
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchPage(page) {
  const res = await fetch(`${BASE_URL}?page=${page}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} on page ${page}`);
  const data = await res.json();
  return data.products || [];
}

async function main() {
  const images = {};
  let page = 1;

  console.log("Fetching Skylanders products from easybuy-shop.de...");

  while (true) {
    const products = await fetchPage(page);
    if (products.length === 0) break;

    for (const p of products) {
      const imageSrc = p.image?.src || (p.images?.[0]?.src ?? null);
      if (!imageSrc) continue;

      const key = normalize(p.title);
      if (key && !images[key]) {
        images[key] = imageSrc;
      }
    }

    console.log(`  Page ${page}: ${products.length} products`);
    page++;

    // Small delay to be polite
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nTotal: ${Object.keys(images).length} images found`);
  writeFileSync(OUTPUT, JSON.stringify(images, null, 2) + "\n");
  console.log(`Saved to ${OUTPUT}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
