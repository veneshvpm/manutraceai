import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { QrPassportModal } from './components/common/QrPassportModal';
import { ExpoDemoController } from './components/common/ExpoDemoController';

// Feature Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PassportPage } from './pages/PassportPage';
import { ProductsPage } from './pages/ProductsPage';
import { TraceabilityPage } from './pages/TraceabilityPage';
import { ReverseTracePage } from './pages/ReverseTracePage';
import { AiIntelligencePage } from './pages/AiIntelligencePage';
import { RcaPage } from './pages/RcaPage';
import { ImpactAnalysisPage } from './pages/ImpactAnalysisPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { QualityPage } from './pages/QualityPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { MachinesPage } from './pages/MachinesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const { isAuthenticated, activeTab } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'passport':
        return <PassportPage />;
      case 'products':
        return <ProductsPage />;
      case 'traceability':
        return <TraceabilityPage />;
      case 'reverse-trace':
        return <ReverseTracePage />;
      case 'ai-intelligence':
        return <AiIntelligencePage />;
      case 'rca':
        return <RcaPage />;
      case 'impact':
        return <ImpactAnalysisPage />;
      case 'simulator':
        return <SimulatorPage />;
      case 'quality':
        return <QualityPage />;
      case 'suppliers':
        return <SuppliersPage />;
      case 'machines':
        return <MachinesPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] text-[#343C6A] overflow-hidden font-sans select-none">
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-[#F5F7FA]">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals & Overlay Drawers */}
      <GlobalSearchModal />
      <NotificationDrawer />
      <QrPassportModal />
      <ExpoDemoController />
    </div>
  );
};
