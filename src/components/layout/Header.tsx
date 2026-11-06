import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  X,
  MessageSquare,
  KeyRound,
  LogOut,
  ArrowUpRight,
} from 'lucide-react';
import { getModuleById, searchGlobalCatalog } from '../../utils/foundation';
import { GlobalSearchScope, ModuleId } from '../../types/navigation';
import { ModuleIcon } from './ModuleIcon';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  activeModule: ModuleId;
  onSelectModule: (moduleId: ModuleId) => void;
  onOpenMobileMenu: () => void;
  onOpenLoginScreen: () => void;
  onOpenAssistant?: () => void;
}

const SEARCH_SCOPES: { id: GlobalSearchScope; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'items', label: 'Items' },
  { id: 'godowns', label: 'Godowns' },
  { id: 'stock', label: 'Stock' },
  { id: 'modules', label: 'Modules' },
];

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  onSelectModule,
  onOpenMobileMenu,
  onOpenLoginScreen,
  onOpenAssistant,
}) => {
  const currentModule = getModuleById(activeModule);
  const { user, session, signOut, isSubmitting } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState<GlobalSearchScope>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const searchResults = searchGlobalCatalog(searchQuery, searchScope);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
        searchInputRef.current?.focus();
      } else if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectResult = (moduleId: ModuleId) => {
    onSelectModule(moduleId);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="h-14 sm:h-16 liquid-glass border-b border-white/80 px-3 sm:px-6 flex items-center justify-between gap-2.5 sm:gap-6 shrink-0 sticky top-0 z-30">
      {/* Zone 1: Brand / Breadcrumb Wordmark (Single-line) */}
      <div className="flex items-center gap-2 min-w-0 shrink-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden w-9 h-9 -ml-1 flex items-center justify-center rounded-xl text-slate-700 hover:text-slate-900 hover:bg-white/70 transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
          <span className="text-slate-500 font-normal">Inventory</span>
          <span className="text-slate-300 font-normal" aria-hidden="true">
            /
          </span>
          <span className="text-slate-900 font-semibold truncate">
            {currentModule.title}
          </span>
        </div>
      </div>

      {/* Zone 2: Global Search across Items, Godowns, Stock & Modules */}
      <div
        ref={searchContainerRef}
        className="relative flex-1 max-w-md mx-auto min-w-0"
      >
        <div className="relative flex items-center">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            type="text"
            role="searchbox"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            placeholder="Search items, godowns, stock..."
            aria-label="Global search across items, godowns, and stock records"
            aria-expanded={isSearchOpen}
            className="w-full pl-9 pr-8 py-2 text-xs liquid-glass-subtle rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              aria-label="Clear global search"
              className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {isSearchOpen && (
          <div
            role="region"
            aria-label="Global search results"
            className="fixed sm:absolute left-3 right-3 sm:left-0 sm:right-0 top-15 sm:top-full sm:mt-2 liquid-glass-elevated rounded-2xl p-3 z-50 border border-white/95 shadow-lg space-y-3"
          >
            {/* Scope Filter Bar */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
              <div
                role="group"
                aria-label="Filter global search scope"
                className="flex items-center gap-1 overflow-x-auto"
              >
                {SEARCH_SCOPES.map((sc) => {
                  const active = searchScope === sc.id;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setSearchScope(sc.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        active
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                      }`}
                    >
                      {sc.label}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close global search"
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Matching Records & Modules */}
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
              {searchResults.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No matching items, godowns, or stock records for "{searchQuery}"
                </div>
              ) : (
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => handleSelectResult(result.moduleId)}
                    className="w-full text-left py-2.5 px-2.5 hover:bg-white/80 rounded-xl transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl liquid-glass-subtle flex items-center justify-center text-slate-700 shrink-0">
                        <ModuleIcon
                          moduleId={result.moduleId}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {result.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {result.subtitle}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-mono text-slate-400 group-hover:text-slate-900">
                      <span className="hidden sm:inline">
                        {result.matchedField.split('·')[0].trim()}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Zone 3: Assistant & Auth Session / Sign Out Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {onOpenAssistant && (
          <button
            type="button"
            onClick={onOpenAssistant}
            aria-label="Open Inventory Assistant"
            className="h-9 px-3 text-xs font-medium text-slate-700 liquid-glass-subtle hover:bg-white/90 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-700" aria-hidden="true" />
            <span className="hidden sm:inline">Assistant</span>
          </button>
        )}

        {session ? (
          <div className="flex items-center gap-2">
            {user?.email && (
              <span className="hidden md:inline-block text-xs font-mono text-slate-600 max-w-36 truncate">
                {user.email}
              </span>
            )}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={async () => {
                await signOut();
                onOpenLoginScreen();
              }}
              aria-label="Sign out of Inventory System"
              className="h-9 px-3 sm:px-3.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenLoginScreen}
            className="h-9 px-3 sm:px-3.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Sign In</span>
            <span className="sm:hidden">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};

