import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { supabase, type BuybackOrder, type BuybackStatus, STATUS_LABELS, STATUS_COLORS } from '../../lib/supabase';

const ALL_STATUSES: BuybackStatus[] = ['pending', 'reviewing', 'confirmed', 'shipped', 'received', 'paid', 'rejected'];

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<BuybackOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const activeStatus = searchParams.get('status') as BuybackStatus | null;

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    const { data } = await supabase
      .from('buyback_order')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  const filtered = orders.filter((o) => {
    if (activeStatus && o.status !== activeStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.seller_name.toLowerCase().includes(q) ||
        o.seller_email.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ankaufs-Vorgaenge</h1>
          <p className="mt-1 text-slate-400">{orders.length} Vorgaenge insgesamt</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, E-Mail oder ID suchen..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSearchParams({})}
            className={`chip text-xs ${!activeStatus ? 'active' : ''}`}
          >
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            Alle
          </button>
          {ALL_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setSearchParams({ status })}
              className={`chip text-xs ${activeStatus === status ? 'active' : ''}`}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-slate-400">Keine Vorgaenge gefunden.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Datum</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Verkaeufer</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Betrag</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Zahlung</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-sm text-slate-300">
                      {new Date(order.created_at).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium text-white">{order.seller_name}</div>
                      <div className="text-xs text-slate-500">{order.seller_email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-mono text-sm text-emerald-400">{Number(order.total_price).toFixed(2)} {'\u20AC'}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {order.payment_method === 'bank_transfer' ? 'Ueberweisung' : 'PayPal'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-sm"
                      >
                        Details <ChevronRight className="w-4 h-4 ml-0.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
