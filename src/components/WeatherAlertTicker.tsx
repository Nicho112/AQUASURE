import React from "react";
import { AlertCircle, Radio } from "lucide-react";

export const WeatherAlertTicker: React.FC = () => {
  const alerts = [
    "PAGASA FLOOD ADVISORY #04: Agusan River Basin water level at 7.42m (Alert Level 2). Precautionary evacuation advised for low-lying riverside communities in Barangay Banza, Dagohoy, and Doongan.",
    "SEVERE WEATHER BULLETIN: Moderate to heavy rain showers with lightning and strong gusty winds expected over Butuan City and Agusan del Norte due to active localized thunderstorm clusters.",
    "CDRRMO BUTUAN: Emergency Operations Center is on RED ALERT. All official evacuation centers (Sports Complex, FSUU Gym, Doongan High) are open and staffed with medical personnel.",
    "TIDAL ADVISORY: High tide peak expected at 06:45 AM and 07:15 PM. Coastal backwater flooding possible in Barangay Lumbocan and riverside zones."
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 px-4 py-2.5 flex items-center shadow-lg">
      <div className="flex items-center space-x-2 shrink-0 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse mr-3">
        <Radio className="w-3.5 h-3.5" />
        <span>PAGASA / CDRRMO Live Feed</span>
      </div>
      
      <div className="overflow-hidden whitespace-nowrap flex-1 relative flex items-center">
        <div className="inline-block animate-marquee text-xs text-slate-200 font-medium space-x-12">
          {alerts.map((alert, idx) => (
            <span key={idx} className="inline-flex items-center space-x-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{alert}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
