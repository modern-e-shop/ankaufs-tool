import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---- Types ----

export type BuybackStatus = 'pending' | 'reviewing' | 'confirmed' | 'shipped' | 'received' | 'paid' | 'rejected';
export type PaymentMethodDB = 'bank_transfer' | 'paypal';

export interface ProductType {
  id: string;
  name: string;
  icon: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface ProductSubcategory {
  id: string;
  product_type_id: string;
  name: string;
  slug: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface ProductDB {
  id: string;
  subcategory_id: string;
  name: string;
  price: number;
  image_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BuybackOrder {
  id: string;
  status: BuybackStatus;
  total_price: number;
  description: string | null;
  payment_method: PaymentMethodDB;
  payment_details: Record<string, string>;
  seller_name: string;
  seller_email: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BuybackOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  price: number;
  created_at: string;
}

export const STATUS_LABELS: Record<BuybackStatus, string> = {
  pending: 'Offen',
  reviewing: 'In Prüfung',
  confirmed: 'Bestätigt',
  shipped: 'Versendet',
  received: 'Erhalten',
  paid: 'Bezahlt',
  rejected: 'Abgelehnt',
};

export const STATUS_COLORS: Record<BuybackStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  reviewing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  confirmed: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  shipped: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  received: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  paid: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
};
