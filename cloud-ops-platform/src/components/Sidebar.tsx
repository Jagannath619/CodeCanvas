'use client';
import { useApp } from '@/lib/store';
import { Server, HardDrive, Network, Database, Shield, Activity, LogOut, Moon, Sun, History, Eye, Pencil } from 'lucide-react';

const sections = [
  { id: 'compute', label: 'Compute', icon: Server },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'networking', label: 'Networking', icon: Network },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
  { id: 'history', label: 'History', icon: History },
];

export default function Sidebar() {
  const { activeSection, setActiveSection, darkMode, toggleDarkMode, readOnlyMode, toggleReadOnly, logout, accountInfo } = useApp();

  return (
    <aside className={`w-64 h-screen flex flex-col border-r ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cloud Ops</h2>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">{accountInfo?.account || 'Connected'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeSection === id
                ? darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className={`p-3 border-t space-y-2 ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <button
          onClick={toggleReadOnly}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
            readOnlyMode
              ? 'bg-green-900/30 text-green-400'
              : 'bg-orange-900/30 text-orange-400'
          }`}
        >
          {readOnlyMode ? <Eye className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          {readOnlyMode ? 'Read-Only Mode' : 'Write Mode'}
        </button>
        <button
          onClick={toggleDarkMode}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>
    </aside>
  );
}
