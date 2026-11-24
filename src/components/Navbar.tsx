import React from "react";
import { ActiveTab, WaterGaugeTelemetry } from "../types";
import { MapPin, BarChart3, AlertTriangle, FileText, Presentation, Rocket, Activity, Waves, TrendingUp, WifiOff, CheckCircle2, Smartphone, Share2 } from "lucide-react";
import { WeatherWidget } from "./WeatherWidget";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  telemetry: WaterGaugeTelemetry | null;
  onOpenReportModal: () => void;
  onOpenPrediction: () => void;
  onOpenSmsModal: () => void;
  onOpenadmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  telemetry,
  onOpenReportModal,
  onOpenPrediction,
  onOpenSmsModal,
  onOpenadmin,
}) => {
  return (
    <header role="banner" className="bg-slate-900 text-white shadow-lg border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Agusan River Flood GIS
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium hidden sm:inline-block">
                  Butuan City
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Web GIS Final Project — Flood Risk Dashboard & Evacuation Locator
              </p>
            </div>
          </div>

          {/* Real-time Telemetry & Weather Widgets */}
          <div className="hidden xl:flex items-center space-x-3">
            {telemetry && (
              <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700/80 px-3 py-2 rounded-xl text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-slate-300 font-medium">Agusan Stn:</span>
                  <span className="font-bold text-white">{telemetry.currentLevelMeters.toFixed(2)}m</span>
                </div>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-400 font-semibold">{telemetry.status}</span>
              </div>
            )}
            <WeatherWidget />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenPrediction}
              aria-label="Open AI Flood Predictions"
              className="hidden lg:inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-all"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Flood Horizon</span>
            </button>

            <button
              onClick={onOpenSmsModal}
              aria-label="Open SMS Flood Alert Registry"
              title="Register mobile number for SMS alerts"
              className="hidden md:inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-all"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>SMS Alerts</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav role="navigation" aria-label="Main Dashboard Navigation" className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800 pt-2">
          <div role="tablist" aria-label="Views" className="flex space-x-1">
            <button
              role="tab"
              aria-selected={activeTab === "map"}
              aria-label="GIS Map & Spatial Analysis (Shortcut: M)"
              onClick={() => setActiveTab("map")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "map"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>GIS Map & Spatial Analysis</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === "analysis"}
              aria-label="Analysis Dashboard (Shortcut: A)"
              onClick={() => setActiveTab("analysis")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "analysis"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analysis Dashboard</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === "incidents"}
              aria-label="Historical Flood Logs (Shortcut: I)"
              onClick={() => setActiveTab("incidents")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "incidents"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Historical Flood Logs</span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === "admin"}
              aria-label="AdminDashboard (Shortcut: N)"
              onClick={() => setActiveTab("admin")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "admin"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
