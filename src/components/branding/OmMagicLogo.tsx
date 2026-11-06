import React from 'react';
import { Layers } from 'lucide-react';

interface SystemBrandProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const SystemBrandMark: React.FC<SystemBrandProps> = ({
  size = 'md',
  showTagline = false,
}) => {
  const boxSizeClasses =
    size === 'lg'
      ? 'w-11 h-11 rounded-2xl'
      : size === 'sm'
      ? 'w-8 h-8 rounded-xl'
      : 'w-9 h-9 rounded-xl';

  const iconSizeClasses =
    size === 'lg' ? 'w-5 h-5' : size === 'sm' ? 'w-4 h-4' : 'w-4 h-4';

  const titleClasses =
    size === 'lg'
      ? 'text-xl tracking-tight'
      : size === 'sm'
      ? 'text-sm tracking-tight'
      : 'text-base tracking-tight';

  return (
    <div className="flex items-center gap-3 select-none shrink-0">
      <div
        className={`${boxSizeClasses} liquid-glass-elevated text-slate-900 flex items-center justify-center shrink-0`}
        aria-hidden="true"
      >
        <Layers className={`${iconSizeClasses} text-slate-800`} />
      </div>
      <div className="flex flex-col min-w-0">
        <span
          className={`${titleClasses} text-slate-900 font-semibold leading-none whitespace-nowrap`}
        >
          Inventory System
        </span>
        {showTagline && (
          <span className="text-xs text-slate-500 mt-1 leading-none whitespace-nowrap">
            Made by Raju Singh
          </span>
        )}
      </div>
    </div>
  );
};

export const OmMagicLogo = SystemBrandMark;
