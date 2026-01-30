
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ICONS, COLORS } from '../constants';

const SidebarItem: React.FC<{ to: string, icon: React.ReactNode, label: string, active: boolean }> = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
      ${active ? 'bg-slate-800 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: ICONS.Dashboard },
    { to: '/sales', label: 'Sales', icon: ICONS.Sales },
    { to: '/inventory', label: 'Inventory', icon: ICONS.Inventory },
    { to: '/purchase', label: 'Purchase', icon: ICONS.Purchase },
    { to: '/finance', label: 'Finance', icon: ICONS.Finance },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 text-white p-2 rounded-lg">
              <ICONS.Dashboard size={24} />
            </div>
            {isSidebarOpen && <span className="text-xl font-bold text-slate-900 tracking-tight">ZenERP</span>}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map(item => (
            <SidebarItem 
              key={item.to}
              to={item.to}
              label={isSidebarOpen ? item.label : ''}
              icon={item.icon}
              active={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            {isSidebarOpen ? 'Collapse' : '»'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 z-10">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-96 max-w-full">
            <ICONS.Search className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search across ERP..." 
              className="bg-transparent border-none outline-none ml-2 text-sm w-full text-slate-600"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              JD
            </div>
          </div>
        </header>

        {/* Scrollable View */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
