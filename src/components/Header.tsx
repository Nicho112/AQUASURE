import React from "react";
import { WaterGaugeTelemetry } from "../types";
import { CloudRain, Bell, Calendar, Smartphone, Share2, Download, Menu, User, LogOut } from "lucide-react";

interface AurassureHeaderProps {
  telemetry: WaterGaugeTelemetry | null;
  onOpenSmsModal: () => void;
  onOpenShareModal: () => void;
  onToggleSidebar: () => void;
  currentUser: { name: string; email: string; role: string } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const AurassureHeader: React.FC<AurassureHeaderProps> = ({
  telemetry,
  onOpenSmsModal,
  onOpenShareModal,
  onToggleSidebar,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 text-white z-20">
      {/* Title & Live Status */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
        <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center space-x-2">
          <span>Flood Monitoring Intelligence</span>
          <span className="text-xs font-normal text-slate-400 hidden sm:inline">(Agusan River - Butuan City)</span>
        </h1>
        <div className="hidden xl:flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full text-emerald-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Live Telemetry</span>
        </div>
      </div>

      {/* Right Controls & Widgets */}
      <div className="flex items-center space-x-4">
        {/* Weather Indicator */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
          <CloudRain className="w-4 h-4 text-cyan-400" />
          <span>24°C • Light Rain</span>
        </div>

        {/* Date & Time */}
        <div className="hidden md:flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>{currentTime}, {currentDate}</span>
        </div>

        <button
          onClick={onOpenSmsModal}
          className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>SMS Registry</span>
        </button>

        {/* User Auth / Login / Account Button */}
        {currentUser ? (
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-white hidden sm:inline">{currentUser.name}</span>
            <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
              {currentUser.role}
            </span>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Login / Create Account</span>
          </button>
        )}
      </div>
    </header>
  );
};
