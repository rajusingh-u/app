import React from 'react';
import { KeyRound, LogOut } from 'lucide-react';
import {
  MODULE_CATEGORIES,
  getModulesByCategory,
} from '../../utils/foundation';
import { ModuleId } from '../../types/navigation';
import { OmMagicLogo } from '../branding/OmMagicLogo';
import { ModuleIcon } from './ModuleIcon';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeModule: ModuleId;
  onSelectModule: (moduleId: ModuleId) => void;
  onOpenLoginScreen: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  onOpenLoginScreen,
}) => {
  const groupedModules = getModulesByCategory();
  const { user, session, signOut, isSubmitting } = useAuth();

  return (
    <aside
      aria-label="Primary ERP Navigation"
      className="hidden lg:flex lg:flex-col lg:w-68 lg:shrink-0 liquid-glass border-r border-white/80 select-none"
    >
      {/* Top Brand Zone */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200/60 shrink-0">
        <button
          type="button"
          onClick={() => onSelectModule('dashboard')}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl cursor-pointer"
        >
          <OmMagicLogo variant="light" size="md" showTagline />
        </button>
      </div>

      {/* Scrollable Module Navigation */}
      <nav
        aria-label="ERP Modules"
        className="flex-1 overflow-y-auto px-3 py-4 space-y-6"
      >
        {MODULE_CATEGORIES.map((category) => {
          const modulesInCategory = groupedModules[category];
          return (
            <div key={category} className="space-y-1">
              <div className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-slate-400">
                {category}
              </div>
              <ul className="space-y-1">
                {modulesInCategory.map((mod) => {
                  const isActive = activeModule === mod.id;
                  return (
                    <li key={mod.id}>
                      <button
                        type="button"
                        onClick={() => onSelectModule(mod.id)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'liquid-glass-elevated text-slate-900 font-semibold'
                            : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                        }`}
                      >
                        <span className="flex items-center gap-3 min-w-0">
                          <ModuleIcon
                            moduleId={mod.id}
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-sky-600' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate whitespace-nowrap">
                            {mod.title}
                          </span>
                        </span>
                        <span
                          className={`font-mono text-[10px] tabular-nums shrink-0 ${
                            isActive ? 'text-sky-700 font-semibold' : 'text-slate-400'
                          }`}
                        >
                          {mod.code.replace('MOD-', '')}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer: Creator Credit & Authentication Session Control */}
      <div className="p-3.5 border-t border-slate-200/60 bg-white/40 shrink-0 space-y-2.5">
        <div className="px-2 py-0.5 text-[11px] text-slate-500 flex items-center justify-between gap-2">
          <span className="truncate">Made by Raju Singh</span>
          <span className="font-mono text-slate-600 shrink-0">
            {session ? 'Signed In' : 'Supabase Auth'}
          </span>
        </div>
        {user?.email && (
          <div className="px-2 text-[11px] font-mono text-slate-700 truncate">
            {user.email}
          </div>
        )}
        {session ? (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={async () => {
              await signOut();
              onOpenLoginScreen();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-800 liquid-glass-subtle hover:bg-white/90 disabled:opacity-60 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenLoginScreen}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-800 liquid-glass-subtle hover:bg-white/90 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
            <span>Sign In Screen</span>
          </button>
        )}
      </div>
    </aside>
  );
};

