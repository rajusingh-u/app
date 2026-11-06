import React from 'react';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Boxes,
  ArrowLeftRight,
  FolderKanban,
  Briefcase,
  Factory,
  FileSpreadsheet,
  Landmark,
  Users,
  Bell,
  Settings,
} from 'lucide-react';
import { ModuleId } from '../../types/navigation';

interface ModuleIconProps {
  moduleId: ModuleId;
  className?: string;
}

export const ModuleIcon: React.FC<ModuleIconProps> = ({
  moduleId,
  className = 'w-4 h-4',
}) => {
  switch (moduleId) {
    case 'dashboard':
      return <LayoutDashboard className={className} aria-hidden="true" />;
    case 'items':
      return <Package className={className} aria-hidden="true" />;
    case 'godowns':
      return <Warehouse className={className} aria-hidden="true" />;
    case 'stock':
      return <Boxes className={className} aria-hidden="true" />;
    case 'stock-transfer':
      return <ArrowLeftRight className={className} aria-hidden="true" />;
    case 'opening-stock':
      return <FolderKanban className={className} aria-hidden="true" />;
    case 'contractors':
      return <Briefcase className={className} aria-hidden="true" />;
    case 'manufacturing':
      return <Factory className={className} aria-hidden="true" />;
    case 'monthly-reports':
      return <FileSpreadsheet className={className} aria-hidden="true" />;
    case 'godown-rent':
      return <Landmark className={className} aria-hidden="true" />;
    case 'users':
      return <Users className={className} aria-hidden="true" />;
    case 'notifications':
      return <Bell className={className} aria-hidden="true" />;
    case 'settings':
      return <Settings className={className} aria-hidden="true" />;
    default:
      return <LayoutDashboard className={className} aria-hidden="true" />;
  }
};
