import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, Clock, ChevronRight, BarChart3 } from 'lucide-react';
import { supabase, type BuybackOrder, STATUS_LABELS, STATUS_COLORS, type BuybackStatus } from '../../lib/supabase';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<BuybackOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [ordersRes, productsRes] = await Promise.all([
      supabase.from('buyback_order').select('*').order('created_at', { ascending: false }),
      supabase.from('product').select('id', { count: 'exact', head: true }),
    ]);
    setOrders(ordersRes.data || []);
    setProductCount(productsRes.count || 0);
    setLoading(false);
  }

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const todayOrders = orders.filter(o => {
    const today = new Date().toISOString().slice(0, 10);
    return o.created_at.slice(0, 10) === today;
  });
  const totalValue = orders.reduce((sum, o) => sum + Number(o.total_price), 0);

  const statCards = [
    { label: 'Offene Anfragen', value: pendingOrders.length, icon: Clock, color: 'text-yellow-400', link: '/admin/orders?status=pending' },
    { label: 'Heute eingegangen', value: todayOrders.length, icon: ShoppingCart, color: 'text-blue-400', link: '/admin/orders' },
    { label: 'Gesamtwert', value: `${totalValue.toFixed(2)} \u20AC`, icon: DollarSign, color: 'text-emerald-400', link: '/admin/orders' },
    { label: 'Produkte im Katalog', value: productCount, icon: Package, color: 'text-indigo-400', link: '/admin/products' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-slate-400">Uebersicht aller Ankaufs-Vorgaenge</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="glass-card p-5 hover:border-indigo-500/40 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-white font-mono">{card.value}</div>
              <div className="text-sm text-slate-400 mt-1">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Letzte Anfragen
            </h2>
            <Link to="/admin/orders" className="text-sm text-indigo-400 hover:text-indigo-300">
              Alle anzeigen
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-slate-500 text-sm">Noch keine Anfragen vorhanden.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <Link
                  key={order.id}
                  to={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-white">{order.seller_name}</div>
                    <div className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString('de-DE')}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-emerald-400">{Number(order.total_price).toFixed(2)} {'\u20AC'}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            Status-Uebersicht
          </h2>
          <div className="space-y-3">
            {(Object.keys(STATUS_LABELS) as BuybackStatus[]).map((status) => {
              const count = orders.filter(o => o.status === status).length;
              const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border min-w-[80px] text-center ${STATUS_COLORS[status]}`}>
                    {STATUS_LABELS[status]}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500/50 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-mono w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
