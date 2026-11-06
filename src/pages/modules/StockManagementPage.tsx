import React from 'react';
import { getModuleById } from '../../utils/foundation';
import { ModuleId } from '../../types/navigation';
import { EmptyModuleFoundation } from '../../components/ui/EmptyModuleFoundation';

interface ModulePageProps {
  onNavigateModule: (moduleId: ModuleId) => void;
}

export const StockManagementPage: React.FC<ModulePageProps> = ({
  onNavigateModule,
}) => {
  const moduleDef = getModuleById('stock');
  return (
    <EmptyModuleFoundation
      module={moduleDef}
      onNavigateModule={onNavigateModule}
      customToolbarFilters={[
        'All Movements',
        'Inward Receipts',
        'Outward Dispatch',
        'Adjustments',
      ]}
    />
  );
};
