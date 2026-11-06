import React, { useState } from 'react';
import { ModuleId } from '../../types/navigation';
import { Sidebar } from './Sidebar';
import { MobileNavDrawer } from './MobileNavDrawer';
import { Header } from './Header';
import { InventoryAssistantDrawer } from '../chat/InventoryAssistantDrawer';

interface DashboardLayoutProps {
  activeModule: ModuleId;
  onSelectModule: (moduleId: ModuleId) => void;
  onOpenLoginScreen: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeModule,
  onSelectModule,
  onOpenLoginScreen,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen flex text-slate-900 overflow-x-hidden">
      {/* Persistent Desktop Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onSelectModule={onSelectModule}
        onOpenLoginScreen={onOpenLoginScreen}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Header
          activeModule={activeModule}
          onSelectModule={onSelectModule}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenLoginScreen={onOpenLoginScreen}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />

        <MobileNavDrawer
          isOpen={isMobileMenuOpen}
          activeModule={activeModule}
          onClose={() => setIsMobileMenuOpen(false)}
          onOpenMenu={() => setIsMobileMenuOpen(true)}
          onSelectModule={onSelectModule}
          onOpenLoginScreen={onOpenLoginScreen}
        />

        <InventoryAssistantDrawer
          isOpen={isAssistantOpen}
          onClose={() => setIsAssistantOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>

        <footer className="px-4 sm:px-6 lg:px-8 py-4 border-t border-white/80 liquid-glass-subtle text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>Made by Raju Singh</div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onSelectModule('settings')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Settings
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenLoginScreen}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Sign In View
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
