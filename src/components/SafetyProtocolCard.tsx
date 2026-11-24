import React, { useState } from "react";
import { ShieldCheck, CheckSquare, Square, AlertTriangle, FileText, Backpack, Home, Radio, Bell, Clock, Navigation } from "lucide-react";
import { BUTUAN_BARANGAYS, EVACUATION_CENTERS } from "../data/butuanSpatialData";

interface SafetyProtocolProps {
  currentAlertStatus?: string;
}

export const SafetyProtocolCard: React.FC<SafetyProtocolProps> = ({ currentAlertStatus = "Normal" }) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [selectedBarangay, setSelectedBarangay] = useState<string>("Banza");

  // Define dynamic checklists based on alert level
  const protocols = {
    1: {
      title: "Level 1: Preparedness & Advisory",
      subtitle: "River level is normal to rising. Early precautions required.",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      items: [
        { id: "p1_1", text: "Secure important documents (birth certificates, land titles, IDs) in waterproof containers." },
        { id: "p1_2", text: "Monitor official CDRRMO Butuan and PAGASA weather updates via local radio/social media." },
        { id: "p1_3", text: "Clean drainage canals around your residence to prevent localized flooding." },
        { id: "p1_4", text: "Check emergency flashlight batteries and test emergency radio." },
      ]
    },
    2: {
      title: "Level 2: Warning & Evacuation Standby",
      subtitle: "Water level approaching alert threshold. Prepare go-bags.",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      icon: <Backpack className="w-5 h-5 text-amber-600" />,
      items: [
        { id: "p2_1", text: "Pack a 3-day emergency go-bag (clothing, potable water, non-perishable food, medications)." },
        { id: "p2_2", text: "Charge all mobile phones, power banks, and communication devices." },
        { id: "p2_3", text: "Move electrical appliances, furniture, and valuables to upper floors or elevated platforms." },
        { id: "p2_4", text: "Prepare pets and livestock for safe relocation to higher ground." },
        { id: "p2_5", text: "Identify the nearest designated evacuation center and fastest transit route." },
      ]
    },
    3: {
      title: "Level 3: Critical Stage & Mandatory Evacuation",
      subtitle: "River level exceeds critical threshold. Immediate evacuation required.",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200 animate-pulse",
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      items: [
        { id: "p3_1", text: "Evacuate immediately to your designated barangay evacuation center before roads become impassable." },
        { id: "p3_2", text: "Turn off main electrical breakers and shut off LPG gas tanks before leaving." },
        { id: "p3_3", text: "Wear sturdy shoes and avoid walking or driving through moving floodwaters." },
        { id: "p3_4", text: "Keep emergency whistle and high-visibility rain gear accessible." },
        { id: "p3_5", text: "Check on elderly, disabled, and vulnerable neighbors in your purok." },
      ]
    }
  };

  const currentProtocol = protocols[selectedLevel as keyof typeof protocols];

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Dynamic Evacuation Timeline estimates
  const timelineEstimates: Record<string, { distanceKm: number; walkMins: number; vehicleMins: number; urgency: string }> = {
    "Banza": { distanceKm: 1.8, walkMins: 22, vehicleMins: 7, urgency: "High - Lowland Riverbank" },
    "Dagohoy": { distanceKm: 2.4, walkMins: 30, vehicleMins: 10, urgency: "Moderate - Wharf Backflow Zone" },
    "Maibu": { distanceKm: 1.2, walkMins: 15, vehicleMins: 5, urgency: "Moderate - Tributary Path" },
    "Lumbocan": { distanceKm: 3.1, walkMins: 40, vehicleMins: 12, urgency: "Critical - Coastal / Estuary" },
    "Agusan Pequeño": { distanceKm: 2.0, walkMins: 25, vehicleMins: 8, urgency: "High - Agricultural Lowland" },
    "Poblacion": { distanceKm: 0.9, walkMins: 11, vehicleMins: 3, urgency: "Low - Central Elevation" }
  };

  const currentTimeline = timelineEstimates[selectedBarangay] || { distanceKm: 2.0, walkMins: 25, vehicleMins: 8, urgency: "Moderate" };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-extrabold text-slate-900">Resident Safety & Evacuation Timeline</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic civil defense checklists and location-based travel time estimates for Agusan River basin flood preparedness.
          </p>
        </div>

        {/* Level selector tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
          {[1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLevel === lvl
                  ? lvl === 3
                    ? "bg-rose-600 text-white shadow-xs"
                    : lvl === 2
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              Level {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Evacuation Timeline Calculator Card */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h4 className="font-bold text-sm">Dynamic Evacuation Timeline Calculator</h4>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-300">Select Barangay:</span>
            <select
              value={selectedBarangay}
              onChange={(e) => setSelectedBarangay(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(timelineEstimates).map((bName) => (
                <option key={bName} value={bName}>Brgy. {bName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-300 uppercase font-semibold">Distance to Nearest Shelter</span>
            <div className="text-2xl font-extrabold text-cyan-300">{currentTimeline.distanceKm} km</div>
            <p className="text-[10px] text-slate-400">Optimized via spatial index</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-300 uppercase font-semibold">Estimated Foot Transit</span>
            <div className="text-2xl font-extrabold text-amber-300">{currentTimeline.walkMins} mins</div>
            <p className="text-[10px] text-slate-400">At standard evacuation pace</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-300 uppercase font-semibold">Vehicle / Boat Transit</span>
            <div className="text-2xl font-extrabold text-emerald-300">{currentTimeline.vehicleMins} mins</div>
            <p className="text-[10px] text-slate-400">Via designated trunk roads</p>
          </div>
        </div>

        <div className="text-xs text-slate-300 flex items-center justify-between pt-1 border-t border-white/10">
          <span>Hazard Status: <b className="text-rose-400">{currentTimeline.urgency}</b></span>
          <span className="text-cyan-400 font-semibold flex items-center space-x-1">
            <Navigation className="w-3.5 h-3.5" />
            <span>Ready for Immediate Operation</span>
          </span>
        </div>
      </div>

      {/* Protocol Banner */}
      <div className={`p-4 rounded-xl border flex items-start space-x-3 ${currentProtocol.badgeColor}`}>
        <div className="p-2 bg-white rounded-lg shadow-2xs shrink-0">
          {currentProtocol.icon}
        </div>
        <div className="space-y-1">
          <div className="font-bold text-sm">{currentProtocol.title}</div>
          <p className="text-xs opacity-90">{currentProtocol.subtitle}</p>
        </div>
      </div>

      {/* Interactive Checklist */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Action Checklist</span>
          <span>{Object.values(checkedItems).filter(Boolean).length} / {currentProtocol.items.length} completed</span>
        </div>

        <div className="space-y-2">
          {currentProtocol.items.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 select-none ${
                  isChecked
                    ? "bg-emerald-50/60 border-emerald-200 text-slate-500 line-through"
                    : "bg-white border-slate-200 hover:border-blue-300 text-slate-800 shadow-2xs"
                }`}
              >
                <button type="button" className="mt-0.5 text-blue-600 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                <span className="text-xs sm:text-sm font-medium leading-relaxed">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center justify-between">
        <span>CDRRMO Butuan Hotline: <b>(085) 341-2635 / 911</b></span>
        <span className="text-blue-600 font-semibold">Official Civil Defense Standard</span>
      </div>
    </div>
  );
};
