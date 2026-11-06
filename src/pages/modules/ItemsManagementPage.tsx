import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Search, Pencil, Power, X, Package, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

type ItemCategory = 'raw_material' | 'finished_good' | 'packaging' | 'other';
type InventoryItem = {
  id: string; sku: string; name: string; category: ItemCategory; unit: string;
  reorder_level: number; is_active: boolean; description: string | null;
};
type ItemForm = {
  sku: string; name: string; category: ItemCategory; unit: string;
  reorder_level: string; description: string;
};
const emptyForm: ItemForm = {
  sku: '', name: '', category: 'finished_good', unit: 'PCS', reorder_level: '0', description: '',
};
const categoryLabels: Record<ItemCategory, string> = {
  raw_material: 'Raw material', finished_good: 'Finished good', packaging: 'Packaging', other: 'Other',
};

export const ItemsManagementPage: React.FC<{ onNavigateModule: (moduleId: any) => void }> = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | ItemCategory>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ItemForm>(emptyForm);
  const [error, setError] = useState('');

  const loadItems = useCallback(async () => {
    if (!supabase) { setError('Database connection is not configured.'); setLoading(false); return; }
    setLoading(true); setError('');
    const { data, error: queryError } = await supabase.from('items')
      .select('id,sku,name,category,unit,reorder_level,is_active,description')
      .order('name', { ascending: true });
    if (queryError) setError(queryError.message);
    else setItems((data ?? []) as InventoryItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { void loadItems(); }, [loadItems]);

  const visibleItems = useMemo(() => items.filter((item) => {
    const matchesSearch = [item.sku, item.name, item.category].join(' ').toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (category === 'all' || item.category === category) && (showInactive || item.is_active);
  }), [items, search, category, showInactive]);

  const startEdit = (item: InventoryItem) => {
    setEditing(item.id);
    setForm({ sku: item.sku, name: item.name, category: item.category, unit: item.unit,
      reorder_level: String(item.reorder_level), description: item.description ?? '' });
    setError('');
  };
  const startNew = () => { setEditing('new'); setForm(emptyForm); setError(''); };

  const saveItem = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    if (!form.sku.trim() || !form.name.trim() || !form.unit.trim()) {
      setError('SKU, item name and unit are required.'); return;
    }
    const reorder = Number(form.reorder_level);
    if (!Number.isFinite(reorder) || reorder < 0) { setError('Reorder level must be zero or more.'); return; }
    setSaving(true); setError('');
    const payload = { sku: form.sku.trim(), name: form.name.trim(), category: form.category,
      unit: form.unit.trim().toUpperCase(), reorder_level: reorder, description: form.description.trim() || null };
    const result = editing === 'new'
      ? await supabase.from('items').insert({ ...payload, created_by: (await supabase.auth.getUser()).data.user?.id })
      : await supabase.from('items').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing);
    setSaving(false);
    if (result.error) { setError(result.error.message); return; }
    setEditing(null); setForm(emptyForm); await loadItems();
  };

  const toggleActive = async (item: InventoryItem) => {
    if (!supabase || !window.confirm(item.is_active ? 'Deactivate this item? Existing stock history will remain.' : 'Activate this item?')) return;
    const { error: updateError } = await supabase.from('items').update({ is_active: !item.is_active, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (updateError) setError(updateError.message); else await loadItems();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Inventory</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Items</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your item catalogue and units.</p>
        </div>
        <button onClick={startNew} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700">
          <Plus size={16} /> Add item
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Total items</p><p className="mt-1 text-2xl font-semibold">{items.length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Active</p><p className="mt-1 text-2xl font-semibold">{items.filter(x => x.is_active).length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Finished goods</p><p className="mt-1 text-2xl font-semibold">{items.filter(x => x.category === 'finished_good' && x.is_active).length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Raw materials</p><p className="mt-1 text-2xl font-semibold">{items.filter(x => x.category === 'raw_material' && x.is_active).length}</p></div>
      </div>

      {editing && <form onSubmit={saveItem} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between"><h2 className="font-semibold">{editing === 'new' ? 'Add item' : 'Edit item'}</h2><button type="button" onClick={() => setEditing(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18}/></button></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-sm text-slate-600">SKU / Item code<input value={form.sku} onChange={e => setForm({...form,sku:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none focus:border-slate-500" required /></label>
          <label className="text-sm text-slate-600">Item name<input value={form.name} onChange={e => setForm({...form,name:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none focus:border-slate-500" required /></label>
          <label className="text-sm text-slate-600">Category<select value={form.category} onChange={e => setForm({...form,category:e.target.value as ItemCategory})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900">{Object.entries(categoryLabels).map(([key,label]) => <option key={key} value={key}>{label}</option>)}</select></label>
          <label className="text-sm text-slate-600">Unit<input value={form.unit} onChange={e => setForm({...form,unit:e.target.value})} placeholder="PCS, BOX, KG" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none focus:border-slate-500" required /></label>
          <label className="text-sm text-slate-600">Reorder level<input type="number" min="0" step="0.001" value={form.reorder_level} onChange={e => setForm({...form,reorder_level:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none focus:border-slate-500" /></label>
          <label className="text-sm text-slate-600 sm:col-span-2">Description <textarea value={form.description} onChange={e => setForm({...form,description:e.target.value})} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none focus:border-slate-500" /></label>
        </div>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">Cancel</button><button disabled={saving} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save item'}</button></div>
      </form>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by SKU or item name" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-500"/></div>
        <select value={category} onChange={e => setCategory(e.target.value as typeof category)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="all">All categories</option>{Object.entries(categoryLabels).map(([key,label]) => <option key={key} value={key}>{label}</option>)}</select>
        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600"><input type="checkbox" checked={showInactive} onChange={e => setShowInactive(e.target.checked)}/> Show inactive</label>
        <button onClick={() => void loadItems()} className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-600"><RefreshCw size={17}/></button>
      </div>

      {error && !editing && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {loading ? <div className="p-10 text-center text-sm text-slate-500">Loading items…</div> : visibleItems.length === 0 ? <div className="p-10 text-center"><Package className="mx-auto mb-3 text-slate-300" size={28}/><p className="font-medium text-slate-800">No items found</p><p className="mt-1 text-sm text-slate-500">{items.length ? 'Try changing your search or filter.' : 'Add your first item to start building the catalogue.'}</p></div> :
        <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-4 py-3 font-medium">Item</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Unit</th><th className="px-4 py-3 font-medium">Reorder level</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 text-right font-medium">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleItems.map(item => <tr key={item.id} className="hover:bg-slate-50/70"><td className="px-4 py-3"><p className="font-medium text-slate-900">{item.name}</p><p className="text-xs text-slate-500">{item.sku}</p></td><td className="px-4 py-3 text-slate-600">{categoryLabels[item.category]}</td><td className="px-4 py-3 text-slate-600">{item.unit}</td><td className="px-4 py-3 tabular-nums text-slate-600">{item.reorder_level}</td><td className="px-4 py-3"><span className={item.is_active ? 'rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700' : 'rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500'}>{item.is_active ? 'Active' : 'Inactive'}</span></td><td className="px-4 py-3"><div className="flex justify-end gap-1"><button onClick={() => startEdit(item)} aria-label="Edit item" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"><Pencil size={16}/></button><button onClick={() => void toggleActive(item)} aria-label={item.is_active ? 'Deactivate item' : 'Activate item'} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"><Power size={16}/></button></div></td></tr>)}</tbody></table></div>}
      </div>
    </div>
  );
};
