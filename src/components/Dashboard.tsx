import React from "react";
import { FloodIncident, WaterGaugeTelemetry, ActiveTab } from "../types";
import { 
  Waves, 
  CloudRain, 
  AlertTriangle, 
  Bell, 
  Thermometer, 
  Droplets, 
  Wind, 
  TrendingUp, 
  CheckCircle2, 
  MapPin, 
  ArrowUpRight, 
  Activity, 
  ShieldAlert,
  Zap
} from "lucide-react";
import { SafetyProtocolCard } from "./SafetyProtocolCard";

interface AurassureDashboardProps {
  incidents: FloodIncident[];
  telemetry: WaterGaugeTelemetry | null;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPrediction: () => void;
}

export const AurassureDashboard: React.FC<AurassureDashboardProps> = ({
  incidents,
  telemetry,
  setActiveTab,
  onOpenPrediction,
}) => {
  const currentLevel = telemetry ? telemetry.currentLevelMeters : 3.72;
  const [pagasaBulletin, setPagasaBulletin] = React.useState<string | null>(null);
  const [pagasaSources, setPagasaSources] = React.useState<{ title: string; uri: string }[]>([]);
  const [loadingPagasa, setLoadingPagasa] = React.useState<boolean>(false);

  const fetchPagasaBulletin = async () => {
    setLoadingPagasa(true);
    try {
      const res = await fetch("/api/pagasa-forecast");
      const data = await res.json();
      if (data.success) {
        setPagasaBulletin(data.bulletin);
        setPagasaSources(data.sources || []);
      }
    } catch (e) {
      console.error("Failed to fetch PAGASA bulletin:", e);
    } finally {
      setLoadingPagasa(false);
    }
  };

  React.useEffect(() => {
    fetchPagasaBulletin();
  }, []);

  // Aggregate population by risk level
  const riskSummary = BUTUAN_BARANGAYS_SUMMARY_HELPER();

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-slate-950 text-slate-100 min-h-[calc(100vh-4rem)] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Dynamic Dashboard Summary Component for Mobile Users (Condenses main metrics into a compact scrollable grid view) */}
      <div className="block sm:hidden bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
            Mobile Quick Summary
          </span>
          <span className="text-xs font-bold text-slate-400">Agusan River Basin</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Water Level</span>
            <span className="text-lg font-black text-cyan-400">{currentLevel.toFixed(2)}m</span>
            <span className="text-[9px] text-emerald-400 block font-semibold">Normal Range</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Active Incidents</span>
            <span className="text-lg font-black text-rose-400">{incidents.length} Zones</span>
            <span className="text-[9px] text-rose-400 block font-semibold">Requires Watch</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Evac Shelters</span>
            <span className="text-lg font-black text-emerald-400">7 Active</span>
            <span className="text-[9px] text-slate-400 block font-semibold">3,400 Capacity</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Status</span>
            <span className="text-sm font-black text-emerald-400">Operational</span>
            <span className="text-[9px] text-cyan-400 block font-semibold">CDRRMO Guard</span>
          </div>
        </div>
      </div>

      {/* Regional Rainfall Forecast Panel (Google Search Grounded PAGASA Bulletins) */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-cyan-400">
              <CloudRain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">Regional Rainfall Forecast & PAGASA Bulletins</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Google Search Grounded</span>
              </div>
              <p className="text-xs text-slate-400">Official meteorological data and typhoon warnings for Butuan City & Agusan River basin</p>
            </div>
          </div>
          <button
            onClick={fetchPagasaBulletin}
            disabled={loadingPagasa}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-600/20 flex items-center space-x-2 disabled:opacity-50 ring-2 ring-cyan-500/30 active:scale-95"
          >
            <Activity className={`w-3.5 h-3.5 ${loadingPagasa ? "animate-spin" : ""}`} />
            <span>{loadingPagasa ? "Fetching Bulletin..." : "Refresh Bulletin"}</span>
          </button>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
          {loadingPagasa && !pagasaBulletin ? (
            <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
              Querying PAGASA meteorological bulletins via Google Search grounding...
            </div>
          ) : (
            <>
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                {pagasaBulletin || "No active bulletin available."}
              </div>

              {pagasaSources.length > 0 && (
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-bold text-slate-300">Grounded Sources:</span>
                  {pagasaSources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[200px]">{src.title}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Top 7 Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {/* Card 1: Water Level */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Water Level</span>
            <Waves className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-white">{currentLevel} <span className="text-sm font-normal text-slate-400">m</span></div>
            <div className="text-[10px] text-slate-400">Current Average</div>
          </div>
          <div className="text-[11px] text-emerald-400 font-bold flex items-center space-x-1">
            <span>↑ +0.68 m (24h)</span>
          </div>
        </div>

        {/* Card 2: Rainfall Intensity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Rainfall</span>
            <CloudRain className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-white">28.6 <span className="text-sm font-normal text-slate-400">mm/h</span></div>
            <div className="text-[10px] text-slate-400">Current Intensity</div>
          </div>
          <div className="text-[11px] text-blue-400 font-bold">
            <span>↑ +12.4 mm/h (1h)</span>
          </div>
        </div>

        {/* Card 3: Flood Risk */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Flood Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-amber-400">High</div>
            <div className="text-[10px] text-slate-400">Risk Score: 78 / 100</div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[78%]"></div>
          </div>
        </div>

        {/* Card 4: Active Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Alerts</span>
            <Bell className="w-4 h-4 text-rose-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-rose-500">6</div>
            <div className="text-[10px] text-slate-400">Across City Zones</div>
          </div>
          <button 
            onClick={() => setActiveTab("map")}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1"
          >
            <span>View All Alerts</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 5: Temperature */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Temperature</span>
            <Thermometer className="w-4 h-4 text-orange-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-white">24.3 <span className="text-sm font-normal text-slate-400">°C</span></div>
            <div className="text-[10px] text-slate-400">Current</div>
          </div>
          <div className="text-[11px] text-slate-400">Feels like 25.1 °C</div>
        </div>

        {/* Card 6: Humidity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Humidity</span>
            <Droplets className="w-4 h-4 text-blue-300" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-white">88 <span className="text-sm font-normal text-slate-400">%</span></div>
            <div className="text-[10px] text-slate-400">High Saturation</div>
          </div>
          <div className="text-[11px] text-blue-300 font-semibold">Saturated Basin</div>
        </div>

        {/* Card 7: Wind Speed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Wind Speed</span>
            <Wind className="w-4 h-4 text-teal-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold text-white">18.6 <span className="text-sm font-normal text-slate-400">km/h</span></div>
            <div className="text-[10px] text-slate-400">NE Direction</div>
          </div>
          <div className="text-[11px] text-teal-400 font-semibold">Moderate Gusts</div>
        </div>
      </div>

      {/* Second Row: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Water Level Trend */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Water Level Trend <span className="text-xs text-slate-400 font-normal">(Last 24 Hours)</span></h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold">All Stations</span>
              <span className="text-xs font-extrabold text-cyan-400 bg-cyan-950/50 border border-cyan-800 px-2 py-1 rounded-lg">{currentLevel}m AT 10:00 AM</span>
            </div>
          </div>

          <div className="relative h-56 bg-slate-950/60 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div className="absolute inset-x-4 top-8 border-b border-rose-500/40 flex justify-between text-[10px] text-rose-400 font-bold">
              <span>Danger 6.00 m</span>
            </div>
            <div className="absolute inset-x-4 top-16 border-b border-amber-500/40 flex justify-between text-[10px] text-amber-400 font-bold">
              <span>Warning 4.50 m</span>
            </div>
            <div className="absolute inset-x-4 top-24 border-b border-yellow-500/40 flex justify-between text-[10px] text-yellow-400 font-bold">
              <span>Watch 3.00 m</span>
            </div>
            <div className="absolute inset-x-4 top-36 border-b border-emerald-500/40 flex justify-between text-[10px] text-emerald-400 font-bold">
              <span>Normal 1.50 m</span>
            </div>

            <div className="absolute inset-0 flex items-end px-4 pb-6 pt-12 pointer-events-none">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 150">
                <defs>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,120 Q100,110 200,95 T400,65 T600,40 V150 H0 Z"
                  fill="url(#waterGrad)"
                />
                <path
                  d="M0,120 Q100,110 200,95 T400,65 T600,40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
                <circle cx="600" cy="40" r="5" fill="#38bdf8" className="animate-ping" />
                <circle cx="600" cy="40" r="4" fill="#38bdf8" />
              </svg>
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 font-semibold z-10 pt-40">
              <span>10:00</span>
              <span>14:00</span>
              <span>18:00</span>
              <span>22:00</span>
              <span>02:00</span>
              <span>06:00</span>
              <span>10:00</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Rainfall Trend */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Rainfall Trend <span className="text-xs text-slate-400 font-normal">(Intensity & Accumulated)</span></h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-slate-800 p-1 rounded-lg flex space-x-1 text-xs font-bold text-slate-300">
                <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded">24H</span>
              </div>
            </div>
          </div>

          <div className="relative h-56 bg-slate-950/60 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-2">
              <span>🌧️ Rainfall intensity (mm/h)</span>
              <span>🌊 Accumulated (mm)</span>
            </div>

            <div className="flex items-end justify-between h-32 px-2 space-x-1">
              {[12, 18, 14, 22, 19, 25, 30, 42, 38, 55, 68, 85, 60, 45, 30, 25, 20, 15, 12, 28, 45, 52, 60, 75].map((val, idx) => (
                <div key={idx} className="flex-1 bg-blue-600/70 hover:bg-blue-500 rounded-t-xs transition-all" style={{ height: `${val}%` }}></div>
              ))}
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 font-semibold pt-2 border-t border-slate-800">
              <span>10:00</span>
              <span>14:00</span>
              <span>18:00</span>
              <span>22:00</span>
              <span>02:00</span>
              <span>06:00</span>
              <span>10:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row: City Overview Map, Station Status Table, Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">City Overview Map</h3>
            <button 
              onClick={() => setActiveTab("map")}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center space-x-1"
            >
              <span>Open Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
            <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 400 300">
              <path d="M50,0 Q180,120 220,180 T350,300" fill="none" stroke="#0ea5e9" strokeWidth="12" strokeLinecap="round" />
              <path d="M50,0 Q180,120 220,180 T350,300" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="6 4" />
            </svg>

            <div className="absolute top-12 left-24 w-8 h-8 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-xs font-bold text-white shadow-lg cursor-pointer" onClick={() => setActiveTab("map")}>
              01
            </div>
            <div className="absolute top-28 left-48 w-7 h-7 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer" onClick={() => setActiveTab("map")}>
              03
            </div>
            <div className="absolute bottom-16 right-28 w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer" onClick={() => setActiveTab("map")}>
              05
            </div>
            <div className="absolute bottom-8 left-16 w-7 h-7 rounded-full bg-rose-600/30 border-2 border-rose-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer" onClick={() => setActiveTab("map")}>
              12
            </div>

            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-[10px] text-slate-300 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Agusan River Normal Operations</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span><span>Normal</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span><span>Warning</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span>Critical</span></span>
            </div>
            <span className="font-bold text-slate-200">Agusan River</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Station Status</h3>
            <button onClick={() => setActiveTab("incidents")} className="text-xs text-blue-400 hover:text-blue-300 font-bold">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2 font-semibold">Station</th>
                  <th className="pb-2 font-semibold">Location</th>
                  <th className="pb-2 font-semibold">Level</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {[
                  { name: "Riverside Bridge", loc: "North Zone", level: "3.12 m", status: "Normal", color: "text-emerald-400 bg-emerald-500/10" },
                  { name: "Central Park", loc: "Central Zone", level: "2.35 m", status: "Normal", color: "text-emerald-400 bg-emerald-500/10" },
                  { name: "Lakeview Road", loc: "East Zone", level: "2.85 m", status: "Normal", color: "text-emerald-400 bg-emerald-500/10" },
                  { name: "Hilltop Avenue", loc: "North Zone", level: "1.42 m", status: "Normal", color: "text-emerald-400 bg-emerald-500/10" },
                  { name: "Market Street", loc: "Central Zone", level: "2.15 m", status: "Normal", color: "text-emerald-400 bg-emerald-500/10" },
                  { name: "Old City Gate", loc: "West Zone", level: "2.90 m", status: "Normal", color: "text-emerald-400 bg-emerald-500/10" },
                ].map((st, i) => (
                  <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 font-bold text-white">{st.name}</td>
                    <td className="py-2.5 text-slate-400">{st.loc}</td>
                    <td className="py-2.5 font-mono font-bold">{st.level}</td>
                    <td className="py-2.5">
                      <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${st.color}`}>
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Alerts</h3>
            <span className="text-xs text-slate-400">Live Feed</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
            {[
              { title: "Water level stable", desc: "Riverside Bridge (Station 01)", time: "10:23 AM", type: "watch" },
              { title: "Normal rainfall rate", desc: "East Zone catchment basin", time: "10:18 AM", type: "watch" },
              { title: "Telemetry check passed", desc: "All 50 sensor nodes online", time: "10:15 AM", type: "watch" },
              { title: "Weather advisory issued", desc: "Central Zone tributary", time: "10:07 AM", type: "warning" },
            ].map((alt, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
                <div className={`p-2 rounded-lg mt-0.5 ${alt.type === 'critical' ? 'bg-rose-500/20 text-rose-400' : alt.type === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{alt.title}</span>
                    <span className="text-[10px] text-slate-500">{alt.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{alt.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={onOpenPrediction}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Open Flood Horizon</span>
          </button>
        </div>
      </div>

      <div className="pt-2">
        <SafetyProtocolCard />
      </div>
    </div>
  );
};

function BUTUAN_BARANGAYS_SUMMARY_HELPER() {
  return { highPop: 15420, medPop: 11200, lowPop: 4210, highCount: 5, medCount: 3, lowCount: 1 };
}
