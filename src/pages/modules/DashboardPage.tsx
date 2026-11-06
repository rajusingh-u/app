import React from 'react';
import { ArrowUpRight, Clock, Plus } from 'lucide-react';
import { ERP_MODULES } from '../../utils/foundation';
import { ModuleId } from '../../types/navigation';
import { ModuleIcon } from '../../components/layout/ModuleIcon';
import { getSupabaseReadiness } from '../../lib/supabaseConfig';

interface DashboardPageProps {
  onSelectModule: (moduleId: ModuleId) => void;
  onOpenLoginScreen?: () => void;
}

const ESSENTIAL_STATS: {
  id: string;
  label: string;
  sublabel: string;
  targetModule: ModuleId;
}[] = [
  {
    id: 'stat-items',
    label: 'Total Items',
    sublabel: 'SKU Catalog',
    targetModule: 'items',
  },
  {
    id: 'stat-godowns',
    label: 'Active Godowns',
    sublabel: 'Storage Locations',
    targetModule: 'godowns',
  },
  {
    id: 'stat-stock',
    label: 'Stock Ledger',
    sublabel: 'Inward & Outward',
    targetModule: 'stock',
  },
  {
    id: 'stat-transfers',
    label: 'Stock Transfers',
    sublabel: 'Inter-Godown Transit',
    targetModule: 'stock-transfer',
  },
];

const RECENT_ACTIVITY_SLOTS: {
  id: string;
  title: string;
  detail: string;
  moduleId: ModuleId;
  actionLabel: string;
}[] = [
  {
    id: 'act-stock',
    title: 'Stock Movement Ledger',
    detail: 'No inward or outward stock entries recorded in this session',
    moduleId: 'stock',
    actionLabel: 'Record Stock',
  },
  {
    id: 'act-transfer',
    title: 'Inter-Godown Transfers',
    detail: 'No active transit challans pending receipt confirmation',
    moduleId: 'stock-transfer',
    actionLabel: 'New Transfer',
  },
  {
    id: 'act-mfg',
    title: 'Manufacturing & Contractors',
    detail: 'No active production batches or contractor job-work challans',
    moduleId: 'manufacturing',
    actionLabel: 'Open Production',
  },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectModule,
}) => {
  const supabaseState = getSupabaseReadiness();
  const operationalModules = ERP_MODULES.filter((m) => m.id !== 'dashboard');

  return (
    <div className="space-y-7">
      {/* 1. Simple Welcome Header (No oversized hero banner) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            Inventory Overview
          </h1>
          <p className="text-xs text-slate-500">
            {supabaseState.phaseLabel} · Made by Raju Singh
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onSelectModule('stock')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Record Stock</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectModule('stock-transfer')}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 liquid-glass hover:bg-white/90 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
          >
            New Transfer
          </button>
        </div>
      </div>

      {/* 2. Essential Inventory Statistics (Clean, spacious summary cards) */}
      <section aria-label="Essential Inventory Statistics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {ESSENTIAL_STATS.map((stat) => (
            <button
              key={stat.id}
              type="button"
              onClick={() => onSelectModule(stat.targetModule)}
              className="text-left liquid-glass rounded-2xl p-4 sm:p-5 hover:bg-white/90 transition-all group cursor-pointer flex flex-col justify-between gap-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-600 truncate">
                  {stat.label}
                </span>
                <div className="w-8 h-8 rounded-xl liquid-glass-subtle flex items-center justify-center text-slate-600 group-hover:text-slate-900 transition-colors shrink-0">
                  <ModuleIcon
                    moduleId={stat.targetModule}
                    className="w-4 h-4"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl font-semibold font-mono tabular-nums text-slate-900">
                  —
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {stat.sublabel}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Recent Activity in a Minimal List + Essential ERP Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Activity Minimal List */}
        <section
          aria-label="Recent Activity"
          className="lg:col-span-5 liquid-glass rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Activity
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400 tabular-nums">
              0 Events
            </span>
          </div>

          <div className="divide-y divide-slate-200/60">
            {RECENT_ACTIVITY_SLOTS.map((item) => (
              <div
                key={item.id}
                className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="text-xs font-medium text-slate-800 truncate">
                    {item.title}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {item.detail}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectModule(item.moduleId)}
                  className="px-2.5 py-1.5 text-[11px] font-medium text-slate-700 liquid-glass-subtle hover:bg-white rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {item.actionLabel}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Clean ERP Modules Access List */}
        <section
          aria-label="ERP Modules"
          className="lg:col-span-7 liquid-glass rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              ERP Modules
            </h2>
            <span className="text-[11px] text-slate-500">
              {operationalModules.length} Modules
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {operationalModules.map((mod) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => onSelectModule(mod.id)}
                className="w-full text-left p-3 rounded-xl liquid-glass-subtle hover:bg-white/90 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white/80 border border-slate-200/60 flex items-center justify-center text-slate-700 shrink-0">
                    <ModuleIcon moduleId={mod.id} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      {mod.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {mod.category}
                    </div>
                  </div>
                </div>
                <ArrowUpRight
                  className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 shrink-0 transition-colors"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
