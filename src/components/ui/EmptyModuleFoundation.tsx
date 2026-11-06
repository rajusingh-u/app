import React, { useState } from 'react';
import {
  Search,
  Database,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react';
import { AppModuleDefinition, ModuleId } from '../../types/navigation';
import { ModuleIcon } from '../layout/ModuleIcon';

interface EmptyModuleFoundationProps {
  module: AppModuleDefinition;
  onNavigateModule: (moduleId: ModuleId) => void;
  customToolbarFilters?: string[];
  children?: React.ReactNode;
}

export const EmptyModuleFoundation: React.FC<EmptyModuleFoundationProps> = ({
  module,
  onNavigateModule,
  customToolbarFilters = ['All Records', 'Active Scope', 'Archived'],
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(customToolbarFilters[0]);
  const [showReadinessPanel, setShowReadinessPanel] = useState(false);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="liquid-glass rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono font-medium text-slate-800">
              {module.code}
            </span>
            <span aria-hidden="true">·</span>
            <span>{module.category}</span>
            <span aria-hidden="true">·</span>
            <span>Supabase Integration Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            {module.title}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            {module.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateModule('dashboard')}
            className="px-4 py-2 text-xs font-medium text-slate-700 liquid-glass-subtle rounded-xl hover:bg-white/80 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Back to Overview
          </button>
          <button
            type="button"
            onClick={() => setShowReadinessPanel((prev) => !prev)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
          >
            <span>{module.primaryActionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Interactive Phase 1 Notice Drawer when Primary Action is clicked */}
      {showReadinessPanel && (
        <section
          aria-label="Phase 1 Integration Specification"
          className="liquid-glass-elevated rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-sky-700 font-mono">
                <span>{module.code} Specification</span>
                <span aria-hidden="true">·</span>
                <span>Phase 1 Foundation</span>
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                {module.primaryActionLabel} — Database Operations Deferred
              </h2>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                This module shell is structured for direct Supabase integration.
                Database queries, mutations, and schema bindings are intentionally
                deferred so no unrequested tables or mock records are introduced.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowReadinessPanel(false)}
              aria-label="Close module specification notice"
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-200/70">
            {module.capabilities.map((cap, idx) => (
              <div key={cap} className="flex items-start gap-2.5">
                <span className="font-mono text-xs text-sky-600 font-semibold mt-0.5 tabular-nums">
                  0{idx + 1}.
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">{cap}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Optional Module-Specific Foundation Controls */}
      {children}

      {/* Filter & Search Bar Foundation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 liquid-glass p-3.5 rounded-2xl">
        {/* Interactive Segmented Filter Controls */}
        <div
          role="group"
          aria-label={`Filter ${module.title} view`}
          className="flex items-center gap-1 p-1 liquid-glass-pill rounded-xl overflow-x-auto"
        >
          {customToolbarFilters.map((filterLabel) => {
            const isSelected = activeFilter === filterLabel;
            return (
              <button
                key={filterLabel}
                type="button"
                onClick={() => setActiveFilter(filterLabel)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filterLabel}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${module.shortTitle.toLowerCase()}...`}
              aria-label={`Search ${module.title}`}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/75 border border-slate-200/90 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
            />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Structural Data Grid Shell & Unpopulated Empty State */}
      <div className="liquid-glass rounded-2xl overflow-hidden">
        {/* Table Column Header Structure */}
        <div className="overflow-x-auto border-b border-slate-200/70 bg-white/50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                {module.expectedColumns.map((col, idx) => (
                  <th
                    key={col}
                    scope="col"
                    className={`py-3.5 px-4 text-xs font-semibold text-slate-600 whitespace-nowrap ${
                      idx === module.expectedColumns.length - 1
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        {/* Honest Empty Module State (Zero Mock Data) */}
        <div className="px-6 py-14 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl liquid-glass-elevated text-sky-600 flex items-center justify-center mx-auto">
            <ModuleIcon moduleId={module.id} className="w-5 h-5" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-mono tabular-nums">
              <span>0 Records Loaded</span>
              <span aria-hidden="true">·</span>
              <span>Filter: {activeFilter}</span>
            </div>
            <h2 className="text-base font-semibold text-slate-900">
              {searchQuery
                ? `No matching records for "${searchQuery}"`
                : `${module.title} Foundation Ready`}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              No mock or demo records are displayed. This module is prepared for
              live Supabase queries and real-time persistence in the upcoming
              implementation phase.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setShowReadinessPanel(true)}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
            >
              <Database className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Inspect Module Capabilities</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateModule('settings')}
              className="px-4 py-2 text-xs font-medium liquid-glass-subtle text-slate-700 hover:bg-white/80 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Integration Settings</span>
            </button>
          </div>
        </div>

        {/* Footer Metadata Bar */}
        <div className="px-5 py-3.5 bg-white/40 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2
              className="w-3.5 h-3.5 text-sky-600 shrink-0"
              aria-hidden="true"
            />
            <span>
              Module layout, responsive controls, and column schema initialized
            </span>
          </div>
          <div className="font-mono tabular-nums text-slate-600">
            Showing 0 of 0 entries
          </div>
        </div>
      </div>
    </div>
  );
};
