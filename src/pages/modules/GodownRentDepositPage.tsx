import React from 'react';
import { getModuleById } from '../../utils/foundation';
import { ModuleId } from '../../types/navigation';
import { EmptyModuleFoundation } from '../../components/ui/EmptyModuleFoundation';

interface ModulePageProps {
  onNavigateModule: (moduleId: ModuleId) => void;
}

export const GodownRentDepositPage: React.FC<ModulePageProps> = ({
  onNavigateModule,
}) => {
  const moduleDef = getModuleById('godown-rent');
  return (
    <EmptyModuleFoundation
      module={moduleDef}
      onNavigateModule={onNavigateModule}
      customToolbarFilters={[
        'Active Leases',
        'Rent Schedule',
        'Security Deposits',
        'Upcoming Renewals',
      ]}
    />
  );
};
