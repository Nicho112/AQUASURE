import React from "react";
import { ActiveTab } from "../types";
import { 
  LayoutDashboard, 
  MapPin, 
  Radio, 
  Bell, 
  CloudSun, 
  FileText, 
  BarChart3, 
  Cpu, 
  Settings, 
  Users, 
  ScrollText,
  ShieldCheck,
  Droplets
} from "lucide-react";

interface AurassureSidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  alertCount?: number;
  isOpen: boolean;
  onToggle: () => void;
}

export const AurassureSidebar: React.FC<AurassureSidebarProps> = ({ activeTab, setActiveTab, alertCount = 6, isOpen, onToggle }) => {
  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { tab: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { tab: "map", label: "Map View", icon: <MapPin className="w-4 h-4" /> },
    { tab: "incidents", label: "Stations & Logs", icon: <Radio className="w-4 h-4" /> },
    { tab: "analysis", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { tab: "admin", label: "Admin & Auth", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <aside className={`bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 select-none transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-4 sm:px-6 border-b border-slate-800 space-x-3 overflow-hidden">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
          <Droplets className="w-5 h-5 fill-white/20" />
        </div>
        {isOpen && (
          <div className="transition-opacity duration-200 truncate">
            <span className="font-extrabold text-white text-lg tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">AQUASURE</span>
            <span className="block text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">Be Aware, Live Secure</span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {isOpen && <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Navigation Menu</div>}
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              title={!isOpen ? item.label : undefined}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <span className="shrink-0">{item.icon}</span>
                {isOpen && <span className="truncate">{item.label}</span>}
              </div>
              {item.badge && isOpen && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-xs animate-pulse shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {isOpen && (
          <>
            <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">System Modules</div>
            <div className="space-y-1 text-xs text-slate-400 px-3 py-1">
              <div className="flex items-center justify-between py-1 hover:text-white cursor-pointer transition-colors">
                <span>Devices & Gauges</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <div className="flex items-center justify-between py-1 hover:text-white cursor-pointer transition-colors">
                <span>CDRRMO Settings</span>
                <Settings className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="flex items-center justify-between py-1 hover:text-white cursor-pointer transition-colors">
                <span>Operator Users</span>
                <Users className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          </>
        )}
      </nav>

      {/* System Operational Status Card */}
      {isOpen ? (
        <div className="p-4 m-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-xs font-bold text-emerald-400">System Operational</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            All Agusan River sensors and telemetry nodes running normally.
          </p>
        </div>
      ) : (
        <div className="p-3 m-3 flex justify-center bg-slate-900 border border-slate-800 rounded-xl" title="System Operational">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
        </div>
      )}
    </aside>
  );
};
