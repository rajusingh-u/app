import React from 'react';
import { getModuleById } from '../../utils/foundation';
import { ModuleId } from '../../types/navigation';
import { EmptyModuleFoundation } from '../../components/ui/EmptyModuleFoundation';

interface ModulePageProps {
  onNavigateModule: (moduleId: ModuleId) => void;
}

export const ContractorsPage: React.FC<ModulePageProps> = ({
  onNavigateModule,
}) => {
  const moduleDef = getModuleById('contractors');
  return (
    <EmptyModuleFoundation
      module={moduleDef}
      onNavigateModule={onNavigateModule}
      customToolbarFilters={[
        'All Contractors',
        'Active Job Work',
        'Pending Returns',
        'Rate Cards',
      ]}
    />
  );
};
