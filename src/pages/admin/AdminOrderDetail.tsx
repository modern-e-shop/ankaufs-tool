import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, CreditCard, Package, MessageSquare, CheckCircle, XCircle, Banknote } from 'lucide-react';
import { supabase, type BuybackOrder, type BuybackOrderItem, type BuybackStatus, STATUS_LABELS, STATUS_COLORS } from '../../lib/supabase';
import { Toaster, toast } from 'sonner';

const STATUS_FLOW: BuybackStatus[] = ['pending', 'reviewing', 'confirmed', 'shipped', 'received', 'paid'];

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<BuybackOrder | null>(null);
  const [items, setItems] = useState<BuybackOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) loadOrder(id);
  }, [id]);

  async function loadOrder(orderId: string) {
    setLoading(true);
    const [orderRes, itemsRes] = await Promise.all([
      supabase.from('buyback_order').select('*').eq('id', orderId).single(),
      supabase.from('buyback_order_item').select('*').eq('order_id', orderId),
    ]);
    if (orderRes.data) {
      setOrder(orderRes.data);
      setNotes(orderRes.data.notes || '');
    }
    setItems(itemsRes.data || []);
    setLoading(false);
  }

  async function updateStatus(newStatus: BuybackStatus) {
    if (!order) return;
    setSaving(true);
    const { error } = await supabase
      .from('buyback_order')
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        notes: notes || null,
      })
      .eq('id', order.id);

    if (error) {
      toast.error('Fehler beim Speichern');
    } else {
      toast.success(`Status auf "${STATUS_LABELS[newStatus]}" geändert`);
      setOrder({ ...order, status: newStatus, reviewed_at: new Date().toISOString() });
    }
    setSaving(false);
  }

  async function saveNotes() {
    if (!order) return;
    setSaving(true);
    const { error } = await supabase
      .from('buyback_order')
      .update({ notes: notes || null })
      .eq('id', order.id);

    if (error) {
      toast.error('Fehler beim Speichern');
    } else {
      toast.success('Notizen gespeichert');
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-slate-400">Vorgang nicht gefunden.</p>
        <Link to="/admin/orders" className="btn-secondary mt-4 inline-flex">Zurück</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <Toaster position="top-right" theme="dark" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link to="/admin/orders" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Zurück zur Übersicht
          </Link>
          <h1 className="text-2xl font-bold text-white">Ankauf #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Eingegangen am {new Date(order.created_at).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span className={`text-sm px-3 py-1.5 rounded-full border ${STATUS_COLORS[order.status]}`}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Products + Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-indigo-400" />
              Produkte ({items.length})
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]"
                >
                  <span className="text-sm text-white">{item.product_name}</span>
                  <span className="font-mono text-sm text-emerald-400">{Number(item.price).toFixed(2)} €</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <span className="text-sm font-semibold text-white">Gesamt</span>
                <span className="font-mono text-lg font-bold text-emerald-400">{Number(order.total_price).toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {order.description && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Beschreibung</h2>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{order.description}</p>
            </div>
          )}

          {/* Status Actions */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Aktionen</h2>
            <div className="flex flex-wrap gap-3">
              {order.status === 'pending' && (
                <>
                  <button
                    onClick={() => updateStatus('reviewing')}
                    disabled={saving}
                    className="btn-primary text-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> In Prüfung nehmen
                  </button>
                  <button
                    onClick={() => updateStatus('rejected')}
                    disabled={saving}
                    className="btn-secondary text-sm !text-red-400 !border-red-500/30 hover:!bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4" /> Ablehnen
                  </button>
                </>
              )}
              {order.status === 'reviewing' && (
                <>
                  <button onClick={() => updateStatus('confirmed')} disabled={saving} className="btn-primary text-sm">
                    <CheckCircle className="w-4 h-4" /> Bestätigen
                  </button>
                  <button
                    onClick={() => updateStatus('rejected')}
                    disabled={saving}
                    className="btn-secondary text-sm !text-red-400 !border-red-500/30 hover:!bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4" /> Ablehnen
                  </button>
                </>
              )}
              {order.status === 'confirmed' && (
                <button onClick={() => updateStatus('shipped')} disabled={saving} className="btn-primary text-sm">
                  Als versendet markieren
                </button>
              )}
              {order.status === 'shipped' && (
                <button onClick={() => updateStatus('received')} disabled={saving} className="btn-primary text-sm">
                  Als erhalten markieren
                </button>
              )}
              {order.status === 'received' && (
                <button onClick={() => updateStatus('paid')} disabled={saving} className="btn-primary text-sm">
                  <Banknote className="w-4 h-4" /> Als bezahlt markieren
                </button>
              )}
              {(order.status === 'paid' || order.status === 'rejected') && (
                <p className="text-sm text-slate-500">Dieser Vorgang ist abgeschlossen.</p>
              )}
            </div>

            {/* Status Timeline */}
            <div className="mt-6 flex items-center gap-1 overflow-x-auto pb-2">
              {STATUS_FLOW.map((s, i) => {
                const currentIdx = STATUS_FLOW.indexOf(order.status);
                const isRejected = order.status === 'rejected';
                const isActive = !isRejected && STATUS_FLOW.indexOf(s) <= currentIdx;
                return (
                  <div key={s} className="flex items-center gap-1">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isActive ? 'bg-indigo-500' : 'bg-white/10'}`} />
                    <span className={`text-[10px] whitespace-nowrap ${isActive ? 'text-indigo-300' : 'text-slate-600'}`}>
                      {STATUS_LABELS[s]}
                    </span>
                    {i < STATUS_FLOW.length - 1 && (
                      <div className={`w-6 h-px ${isActive ? 'bg-indigo-500/50' : 'bg-white/5'}`} />
                    )}
                  </div>
                );
              })}
              {order.status === 'rejected' && (
                <span className="text-[10px] text-red-400 ml-2">❌ Abgelehnt</span>
              )}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              Interne Notizen
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Interne Notizen zum Vorgang..."
              rows={4}
              className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 resize-none"
            />
            <button onClick={saveNotes} disabled={saving} className="btn-secondary text-sm mt-3">
              Notizen speichern
            </button>
          </div>
        </div>

        {/* Right: Seller Info */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-indigo-400" />
              Verkäufer
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider">Name</label>
                <p className="text-sm text-white mt-0.5">{order.seller_name}</p>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3 h-3" /> E-Mail
                </label>
                <a href={`mailto:${order.seller_email}`} className="text-sm text-indigo-400 hover:text-indigo-300 mt-0.5 block">
                  {order.seller_email}
                </a>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              Zahlungsdaten
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider">Methode</label>
                <p className="text-sm text-white mt-0.5">
                  {order.payment_method === 'bank_transfer' ? '🏦 Banküberweisung' : '💳 PayPal'}
                </p>
              </div>
              {order.payment_method === 'bank_transfer' ? (
                <>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider">IBAN</label>
                    <p className="text-sm text-white font-mono mt-0.5">{order.payment_details.iban || '—'}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider">Kontoinhaber</label>
                    <p className="text-sm text-white mt-0.5">{order.payment_details.account_holder || '—'}</p>
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider">PayPal E-Mail</label>
                  <p className="text-sm text-white mt-0.5">{order.payment_details.paypal_email || '—'}</p>
                </div>
              )}
            </div>
          </div>

          {order.reviewed_at && (
            <div className="glass-card-sm p-4">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Zuletzt bearbeitet</label>
              <p className="text-sm text-slate-300 mt-0.5">
                {new Date(order.reviewed_at).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
