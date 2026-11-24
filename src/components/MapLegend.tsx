import React from "react";
import { Layers, ChevronDown, ChevronUp } from "lucide-react";

export const MapLegend: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="absolute bottom-6 right-6 z-[1000] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 max-w-xs text-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2 font-bold text-slate-900">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Map Legend & Layers</span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-slate-700 transition-colors"
        >
          {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-3">
          {/* Flood Risk Levels */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Barangay Flood Risk
            </span>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-600 inline-block shrink-0"></span>
                <span className="text-slate-700 font-medium">High Risk (Riverbank / Lowland)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block shrink-0"></span>
                <span className="text-slate-700 font-medium">Medium Risk (Tributary Floodplain)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 inline-block shrink-0"></span>
                <span className="text-slate-700 font-medium">Low Risk (Elevated Terrain)</span>
              </div>
            </div>
          </div>

          {/* Evacuation Center Status */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Evacuation Center Status
            </span>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white font-bold shrink-0">🏥</div>
                <span className="text-slate-700 font-medium">Open / Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-[9px] text-white font-bold shrink-0">⚡</div>
                <span className="text-slate-700 font-medium">Near Capacity (&gt;75%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-600 flex items-center justify-center text-[9px] text-white font-bold shrink-0">⚠️</div>
                <span className="text-slate-700 font-medium">Full Capacity</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-500 flex items-center justify-center text-[9px] text-white font-bold shrink-0">🛡️</div>
                <span className="text-slate-700 font-medium">Standby / Standby Prep</span>
              </div>
            </div>
          </div>

          {/* Hydrology */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Hydrography & Spatial Buffer
            </span>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-1.5 bg-blue-500 inline-block rounded-xs"></span>
              <span className="text-slate-700 font-medium">Agusan River Channel</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-3 bg-purple-200/50 border border-purple-400 inline-block rounded-xs"></span>
              <span className="text-slate-700 font-medium">Turf.js Flood Buffer Zone</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
