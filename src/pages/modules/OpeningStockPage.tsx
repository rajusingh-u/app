import React from 'react';
import { getModuleById } from '../../utils/foundation';
import { ModuleId } from '../../types/navigation';
import { EmptyModuleFoundation } from '../../components/ui/EmptyModuleFoundation';

interface ModulePageProps {
  onNavigateModule: (moduleId: ModuleId) => void;
}

export const OpeningStockPage: React.FC<ModulePageProps> = ({
  onNavigateModule,
}) => {
  const moduleDef = getModuleById('opening-stock');
  return (
    <EmptyModuleFoundation
      module={moduleDef}
      onNavigateModule={onNavigateModule}
      customToolbarFilters={[
        'Current Fiscal Period',
        'Verified Balances',
        'Pending Verification',
      ]}
    />
  );
};
