/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppViewMode, ModuleId } from './types/navigation';
import { getModuleById } from './utils/foundation';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/modules/DashboardPage';
import { ItemsManagementPage } from './pages/modules/ItemsManagementPage';
import { GodownManagementPage } from './pages/modules/GodownManagementPage';
import { StockManagementPage } from './pages/modules/StockManagementPage';
import { StockTransferPage } from './pages/modules/StockTransferPage';
import { OpeningStockPage } from './pages/modules/OpeningStockPage';
import { ContractorsPage } from './pages/modules/ContractorsPage';
import { ManufacturingPage } from './pages/modules/ManufacturingPage';
import { MonthlyReportsPage } from './pages/modules/MonthlyReportsPage';
import { GodownRentDepositPage } from './pages/modules/GodownRentDepositPage';
import { UserManagementPage } from './pages/modules/UserManagementPage';
import { NotificationsPage } from './pages/modules/NotificationsPage';
import { SettingsPage } from './pages/modules/SettingsPage';

function getInitialStateFromUrl(): {
  viewMode: AppViewMode;
  activeModule: ModuleId;
  allowLayoutInspection: boolean;
} {
  if (typeof window === 'undefined') {
    return {
      viewMode: 'workspace',
      activeModule: 'dashboard',
      allowLayoutInspection: false,
    };
  }
  const params = new URLSearchParams(window.location.search);
  const viewParam = params.get('view');
  const moduleParam = params.get('module');
  const autostartParam = params.get('autostart');

  const viewMode: AppViewMode = viewParam === 'login' ? 'login' : 'workspace';
  const resolvedModule = moduleParam
    ? getModuleById(moduleParam).id
    : 'dashboard';

  const allowLayoutInspection =
    autostartParam === '1' || viewParam === 'workspace' || Boolean(moduleParam);

  return { viewMode, activeModule: resolvedModule, allowLayoutInspection };
}

export default function App() {
  const initial = getInitialStateFromUrl();
  const [viewMode, setViewMode] = useState<AppViewMode>(initial.viewMode);
  const [activeModule, setActiveModule] = useState<ModuleId>(
    initial.activeModule
  );
  const [allowLayoutInspection, setAllowLayoutInspection] = useState<boolean>(
    initial.allowLayoutInspection
  );

  const handleSelectModule = (moduleId: ModuleId) => {
    setActiveModule(moduleId);
    setViewMode('workspace');
  };

  const handleOpenLoginScreen = () => {
    setAllowLayoutInspection(false);
    setViewMode('login');
  };

  const handleEnableLayoutInspection = (targetModule?: ModuleId) => {
    if (targetModule) {
      setActiveModule(targetModule);
    }
    setAllowLayoutInspection(true);
    setViewMode('workspace');
  };

  const renderModulePage = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardPage
            onSelectModule={handleSelectModule}
            onOpenLoginScreen={handleOpenLoginScreen}
          />
        );
      case 'items':
        return <ItemsManagementPage onNavigateModule={handleSelectModule} />;
      case 'godowns':
        return <GodownManagementPage onNavigateModule={handleSelectModule} />;
      case 'stock':
        return <StockManagementPage onNavigateModule={handleSelectModule} />;
      case 'stock-transfer':
        return <StockTransferPage onNavigateModule={handleSelectModule} />;
      case 'opening-stock':
        return <OpeningStockPage onNavigateModule={handleSelectModule} />;
      case 'contractors':
        return <ContractorsPage onNavigateModule={handleSelectModule} />;
      case 'manufacturing':
        return <ManufacturingPage onNavigateModule={handleSelectModule} />;
      case 'monthly-reports':
        return <MonthlyReportsPage onNavigateModule={handleSelectModule} />;
      case 'godown-rent':
        return <GodownRentDepositPage onNavigateModule={handleSelectModule} />;
      case 'users':
        return <UserManagementPage onNavigateModule={handleSelectModule} />;
      case 'notifications':
        return <NotificationsPage onNavigateModule={handleSelectModule} />;
      case 'settings':
        return (
          <SettingsPage
            onNavigateModule={handleSelectModule}
            onOpenLoginScreen={handleOpenLoginScreen}
          />
        );
      default:
        return (
          <DashboardPage
            onSelectModule={handleSelectModule}
            onOpenLoginScreen={handleOpenLoginScreen}
          />
        );
    }
  };

  return (
    <AuthProvider>
      {viewMode === 'login' ? (
        <LoginPage
          onOpenWorkspace={() => handleEnableLayoutInspection(activeModule)}
          onOpenAdminSettings={() => handleEnableLayoutInspection('settings')}
        />
      ) : (
        <ProtectedRoute
          activeModule={activeModule}
          allowLayoutInspection={allowLayoutInspection}
          onEnableLayoutInspection={handleEnableLayoutInspection}
        >
          <DashboardLayout
            activeModule={activeModule}
            onSelectModule={handleSelectModule}
            onOpenLoginScreen={handleOpenLoginScreen}
          >
            {renderModulePage()}
          </DashboardLayout>
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
