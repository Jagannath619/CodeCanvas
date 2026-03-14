'use client';

import { useApp } from '@/lib/store';
import LoginForm from '@/components/LoginForm';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import ComputeSection from '@/components/sections/ComputeSection';
import StorageSection from '@/components/sections/StorageSection';
import NetworkingSection from '@/components/sections/NetworkingSection';
import DatabaseSection from '@/components/sections/DatabaseSection';
import SecuritySection from '@/components/sections/SecuritySection';
import MonitoringSection from '@/components/sections/MonitoringSection';
import HistorySection from '@/components/sections/HistorySection';

const sectionComponents: Record<string, React.ComponentType> = {
  compute: ComputeSection,
  storage: StorageSection,
  networking: NetworkingSection,
  database: DatabaseSection,
  security: SecuritySection,
  monitoring: MonitoringSection,
  history: HistorySection,
};

export default function Home() {
  const { isAuthenticated, activeSection, darkMode } = useApp();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const ActiveComponent = sectionComponents[activeSection] || ComputeSection;

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}
