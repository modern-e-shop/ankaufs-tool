import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, ChevronDown, Power } from 'lucide-react';
import { supabase, type ProductType, type ProductSubcategory, type ProductDB } from '../../lib/supabase';
import { Toaster, toast } from 'sonner';

interface EditingProduct {
  id?: string;
  name: string;
  price: string;
  subcategory_id: string;
  active: boolean;
}

export default function AdminProducts() {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [subcategories, setSubcategories] = useState<ProductSubcategory[]>([]);
  const [products, setProducts] = useState<ProductDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingProduct | null>(null);
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    const [typesRes, subsRes, prodsRes] = await Promise.all([
      supabase.from('product_type').select('*').order('sort_order'),
      supabase.from('product_subcategory').select('*').order('sort_order'),
      supabase.from('product').select('*').order('name'),
    ]);
    setTypes(typesRes.data || []);
    setSubcategories(subsRes.data || []);
    setProducts(prodsRes.data || []);
    if (!expandedType && typesRes.data?.[0]) {
      setExpandedType(typesRes.data[0].id);
    }
    setLoading(false);
  }

  function startAdd(subcategoryId: string) {
    setEditing({ name: '', price: '', subcategory_id: subcategoryId, active: true });
  }

  function startEdit(product: ProductDB) {
    setEditing({
      id: product.id,
      name: product.name,
      price: String(product.price),
      subcategory_id: product.subcategory_id,
      active: product.active,
    });
  }

  async function saveProduct() {
    if (!editing) return;
    if (!editing.name.trim() || !editing.price) {
      toast.error('Name und Preis sind Pflichtfelder');
      return;
    }
    setSaving(true);

    const data = {
      name: editing.name.trim(),
      price: parseFloat(editing.price),
      subcategory_id: editing.subcategory_id,
      active: editing.active,
    };

    if (editing.id) {
      const { error } = await supabase.from('product').update(data).eq('id', editing.id);
      if (error) toast.error('Fehler: ' + error.message);
      else toast.success('Produkt aktualisiert');
    } else {
      const { error } = await supabase.from('product').insert(data);
      if (error) toast.error('Fehler: ' + error.message);
      else toast.success('Produkt erstellt');
    }

    setEditing(null);
    setSaving(false);
    loadAll();
  }

  async function toggleActive(product: ProductDB) {
    const { error } = await supabase
      .from('product')
      .update({ active: !product.active })
      .eq('id', product.id);

    if (error) toast.error('Fehler');
    else {
      toast.success(product.active ? 'Deaktiviert' : 'Aktiviert');
      loadAll();
    }
  }

  async function deleteProduct(product: ProductDB) {
    if (!confirm(`"${product.name}" wirklich löschen?`)) return;
    const { error } = await supabase.from('product').delete().eq('id', product.id);
    if (error) toast.error('Fehler: ' + error.message);
    else {
      toast.success('Gelöscht');
      loadAll();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <Toaster position="top-right" theme="dark" />

      <div>
        <h1 className="text-3xl font-bold text-white">Produktkatalog</h1>
        <p className="mt-1 text-slate-400">{products.length} Produkte in {subcategories.length} Unterkategorien</p>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {types.map((type) => {
          const typeSubs = subcategories.filter(s => s.product_type_id === type.id);
          const isExpanded = expandedType === type.id;

          return (
            <div key={type.id} className="glass-card overflow-hidden">
              <button
                onClick={() => setExpandedType(isExpanded ? null : type.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <span className="text-lg font-semibold text-white">{type.name}</span>
                  <span className="text-xs text-slate-500">
                    {products.filter(p => typeSubs.some(s => s.id === p.subcategory_id)).length} Produkte
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="border-t border-white/5">
                  {typeSubs.map((sub) => {
                    const subProducts = products.filter(p => p.subcategory_id === sub.id);
                    return (
                      <div key={sub.id} className="border-b border-white/[0.03] last:border-b-0">
                        <div className="flex items-center justify-between px-5 py-3 bg-white/[0.01]">
                          <span className="text-sm font-medium text-indigo-300">{sub.name}</span>
                          <button
                            onClick={() => startAdd(sub.id)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Hinzufügen
                          </button>
                        </div>

                        {/* Add/Edit Row */}
                        {editing && editing.subcategory_id === sub.id && !editing.id && (
                          <div className="flex items-center gap-3 px-5 py-3 bg-indigo-500/5 border-y border-indigo-500/10">
                            <input
                              type="text"
                              value={editing.name}
                              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                              placeholder="Produktname"
                              className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                              autoFocus
                            />
                            <input
                              type="number"
                              value={editing.price}
                              onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                              placeholder="Preis"
                              step="0.50"
                              className="w-24 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                            />
                            <button onClick={saveProduct} disabled={saving} className="text-emerald-400 hover:text-emerald-300">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditing(null)} className="text-slate-500 hover:text-slate-300">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {subProducts.map((product) => (
                          <div key={product.id}>
                            {editing?.id === product.id ? (
                              <div className="flex items-center gap-3 px-5 py-3 bg-indigo-500/5">
                                <input
                                  type="text"
                                  value={editing.name}
                                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                                  autoFocus
                                />
                                <input
                                  type="number"
                                  value={editing.price}
                                  onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                                  step="0.50"
                                  className="w-24 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                                />
                                <button onClick={saveProduct} disabled={saving} className="text-emerald-400 hover:text-emerald-300">
                                  <Check className="w-4 h-4" />
                                </button>
                                <button onClick={() => setEditing(null)} className="text-slate-500 hover:text-slate-300">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between px-5 py-2.5 hover:bg-white/[0.02] transition-colors group">
                                <div className="flex items-center gap-3">
                                  <div className={`w-1.5 h-1.5 rounded-full ${product.active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                                  <span className={`text-sm ${product.active ? 'text-white' : 'text-slate-500 line-through'}`}>
                                    {product.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-sm text-emerald-400">{Number(product.price).toFixed(2)} €</span>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => toggleActive(product)}
                                      className={`p-1 rounded ${product.active ? 'text-yellow-400 hover:bg-yellow-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`}
                                      title={product.active ? 'Deaktivieren' : 'Aktivieren'}
                                    >
                                      <Power className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => startEdit(product)}
                                      className="p-1 rounded text-indigo-400 hover:bg-indigo-500/10"
                                      title="Bearbeiten"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => deleteProduct(product)}
                                      className="p-1 rounded text-red-400 hover:bg-red-500/10"
                                      title="Löschen"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {subProducts.length === 0 && (
                          <p className="px-5 py-3 text-xs text-slate-600">Keine Produkte</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
