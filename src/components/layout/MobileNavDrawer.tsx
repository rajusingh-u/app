import React, { useEffect } from 'react';
import {
  X,
  KeyRound,
  LogOut,
  LayoutDashboard,
  Package,
  Warehouse,
  Boxes,
  Grid,
} from 'lucide-react';
import {
  MODULE_CATEGORIES,
  getModulesByCategory,
} from '../../utils/foundation';
import { ModuleId } from '../../types/navigation';
import { OmMagicLogo } from '../branding/OmMagicLogo';
import { ModuleIcon } from './ModuleIcon';
import { useAuth } from '../../context/AuthContext';

interface MobileNavDrawerProps {
  isOpen: boolean;
  activeModule: ModuleId;
  onClose: () => void;
  onOpenMenu: () => void;
  onSelectModule: (moduleId: ModuleId) => void;
  onOpenLoginScreen: () => void;
}

const PRIMARY_BOTTOM_TABS: {
  id: ModuleId;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: ({ className }) => (
      <LayoutDashboard className={className} aria-hidden="true" />
    ),
  },
  {
    id: 'items',
    label: 'Items',
    icon: ({ className }) => (
      <Package className={className} aria-hidden="true" />
    ),
  },
  {
    id: 'godowns',
    label: 'Godowns',
    icon: ({ className }) => (
      <Warehouse className={className} aria-hidden="true" />
    ),
  },
  {
    id: 'stock',
    label: 'Stock',
    icon: ({ className }) => <Boxes className={className} aria-hidden="true" />,
  },
];

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  activeModule,
  onClose,
  onOpenMenu,
  onSelectModule,
  onOpenLoginScreen,
}) => {
  const groupedModules = getModulesByCategory();
  const { user, session, signOut, isSubmitting } = useAuth();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleModuleClick = (moduleId: ModuleId) => {
    onSelectModule(moduleId);
    onClose();
  };

  const isSecondaryModuleActive = !PRIMARY_BOTTOM_TABS.some(
    (tab) => tab.id === activeModule
  );

  return (
    <>
      {/* Slide-over / Sheet Drawer for All ERP Modules on Mobile & Tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          <div className="relative z-10 w-80 max-w-[86vw] liquid-glass-elevated text-slate-900 h-full flex flex-col border-r border-white/90">
            <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200/70 shrink-0">
              <OmMagicLogo variant="light" size="sm" showTagline />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/70 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <nav
              aria-label="Mobile ERP Modules"
              className="flex-1 overflow-y-auto px-3 py-4 space-y-5"
            >
              {MODULE_CATEGORIES.map((category) => (
                <div key={category} className="space-y-1">
                  <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400">
                    {category}
                  </div>
                  <ul className="space-y-1">
                    {groupedModules[category].map((mod) => {
                      const isActive = activeModule === mod.id;
                      return (
                        <li key={mod.id}>
                          <button
                            type="button"
                            onClick={() => handleModuleClick(mod.id)}
                            aria-current={isActive ? 'page' : undefined}
                            className={`w-full min-h-[44px] flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/80'
                                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                            }`}
                          >
                            <span className="flex items-center gap-3 min-w-0">
                              <ModuleIcon
                                moduleId={mod.id}
                                className={`w-4 h-4 shrink-0 ${
                                  isActive ? 'text-slate-900' : 'text-slate-400'
                                }`}
                              />
                              <span className="truncate whitespace-nowrap">
                                {mod.title}
                              </span>
                            </span>
                            <span
                              className={`font-mono text-[10px] tabular-nums ${
                                isActive
                                  ? 'text-slate-700 font-semibold'
                                  : 'text-slate-400'
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
              ))}
            </nav>

            <div className="p-3.5 border-t border-slate-200/70 bg-white/50 shrink-0 space-y-2">
              <div className="px-1 text-[11px] text-slate-500 text-center">
                Made by Raju Singh
              </div>
              {user?.email && (
                <div className="px-1 text-[11px] font-mono text-slate-700 text-center truncate">
                  {user.email}
                </div>
              )}
              {session ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={async () => {
                    onClose();
                    await signOut();
                    onOpenLoginScreen();
                  }}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 liquid-glass-subtle hover:bg-white/90 disabled:opacity-60 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-slate-700" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLoginScreen();
                  }}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 liquid-glass-subtle hover:bg-white/90 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-slate-700" aria-hidden="true" />
                  <span>Open Login Screen</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Native-Style Fixed Bottom Navigation Bar on Mobile (< lg) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-15 liquid-glass-elevated border-t border-white/90 px-2 grid grid-cols-5 items-center"
      >
        {PRIMARY_BOTTOM_TABS.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeModule === tab.id && !isOpen;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                onClose();
                onSelectModule(tab.id);
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isActive
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <IconComponent
                className={`w-5 h-5 ${
                  isActive ? 'text-slate-900' : 'text-slate-400'
                }`}
              />
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* 5th Tab: More Modules */}
        <button
          type="button"
          onClick={() => (isOpen ? onClose() : onOpenMenu())}
          aria-expanded={isOpen}
          className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
            isOpen || isSecondaryModuleActive
              ? 'text-slate-900 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Grid
            className={`w-5 h-5 ${
              isOpen || isSecondaryModuleActive
                ? 'text-slate-900'
                : 'text-slate-400'
            }`}
            aria-hidden="true"
          />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            Modules
          </span>
        </button>
      </nav>
    </>
  );
};
