import React from 'react';
import { getModuleById } from '../../utils/foundation';
import { ModuleId } from '../../types/navigation';
import { EmptyModuleFoundation } from '../../components/ui/EmptyModuleFoundation';

interface ModulePageProps {
  onNavigateModule: (moduleId: ModuleId) => void;
}

export const NotificationsPage: React.FC<ModulePageProps> = ({
  onNavigateModule,
}) => {
  const moduleDef = getModuleById('notifications');
  return (
    <EmptyModuleFoundation
      module={moduleDef}
      onNavigateModule={onNavigateModule}
      customToolbarFilters={[
        'All Alerts',
        'Low Stock Thresholds',
        'Transfer Receipts',
        'Lease Reminders',
      ]}
    />
  );
};
