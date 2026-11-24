import React, { useState } from "react";
import { Calendar, Clock, TrendingUp, AlertTriangle, ShieldAlert, CloudRain, CheckCircle, X } from "lucide-react";

interface FloodPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloodPredictionModal: React.FC<FloodPredictionModalProps> = ({ isOpen, onClose }) => {
  const [predictionHorizon, setPredictionHorizon] = useState<"day" | "week" | "month">("day");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Agusan River & Hydrological Flood Base</h3>
              <p className="text-xs text-slate-400">Multi-horizon hydrological forecasting (Day, Week, Month)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizon Selector Tabs */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Horizon:</span>
            <div className="flex items-center space-x-1.5 bg-slate-200/80 p-1 rounded-xl">
              <button
                onClick={() => setPredictionHorizon("day")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  predictionHorizon === "day"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                1-Day (24-Hour Lead Time)
              </button>
              <button
                onClick={() => setPredictionHorizon("week")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  predictionHorizon === "week"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                7-Day Outlook
              </button>
              <button
                onClick={() => setPredictionHorizon("month")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  predictionHorizon === "month"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                1-Month Seasonality
              </button>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Model Confidence: 94.2%
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {predictionHorizon === "day" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>24-Hour Hourly Water Level & Discharge Forecast</span>
                </h4>
                <span className="text-xs text-slate-500">Updated 10 mins ago</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-blue-700">06:00 AM (Next)</span>
                  <div className="text-lg font-extrabold text-slate-900">3.85m</div>
                  <p className="text-xs text-slate-600">Stable, normal flow</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-amber-700">12:00 PM (Midday)</span>
                  <div className="text-lg font-extrabold text-slate-900">4.20m</div>
                  <p className="text-xs text-slate-600">Rising due to upland rain</p>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-rose-700">06:00 PM (Evening)</span>
                  <div className="text-lg font-extrabold text-slate-900">4.80m</div>
                  <p className="text-xs text-slate-600">Peak surge expected (Alert Level)</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-blue-700">12:00 AM (Night)</span>
                  <div className="text-lg font-extrabold text-slate-900">4.10m</div>
                  <p className="text-xs text-slate-600">Gradual recession</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-800 text-xs">Recommended Actions for 24-Hour Horizon:</h5>
                <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                  <li>Barangay San Vicente and Dagohoy residents should secure livestock and lower-level items before 12:00 PM.</li>
                  <li>CDRRMO dispatch teams on standby for potential riverside barangay evacuation.</li>
                </ul>
              </div>
            </div>
          )}

          {predictionHorizon === "week" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>7-Day Daily Flood Risk Probability Outlook</span>
                </h4>
                <span className="text-xs text-slate-500">Agusan River Model</span>
              </div>

              <div className="space-y-2">
                {[
                  { day: "Monday (Today)", level: "Moderate (3.9m)", prob: "65%", status: "Advisory" },
                  { day: "Tuesday", level: "High (4.7m)", prob: "88%", status: "Warning" },
                  { day: "Wednesday", level: "Critical (5.2m)", prob: "95%", status: "Mandatory Evac" },
                  { day: "Thursday", level: "High (4.4m)", prob: "75%", status: "Warning" },
                  { day: "Friday", level: "Moderate (3.8m)", prob: "45%", status: "Advisory" },
                  { day: "Saturday", level: "Normal (3.1m)", prob: "20%", status: "Normal" },
                  { day: "Sunday", level: "Normal (2.9m)", prob: "15%", status: "Normal" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold text-slate-800 w-32">{item.day}</span>
                      <span className="text-xs text-slate-600 font-medium">Predicted Peak: <b>{item.level}</b></span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-semibold text-slate-500">Risk Prob: {item.prob}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                        item.status === "Mandatory Evac" || item.status === "Warning"
                          ? "bg-rose-100 text-rose-700"
                          : item.status === "Advisory"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {predictionHorizon === "month" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <CloudRain className="w-4 h-4 text-indigo-600" />
                  <span>1-Month Seasonal Monsoon & Flood Probability Outlook</span>
                </h4>
                <span className="text-xs text-slate-500">Caraga Regional Climate Model</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Weeks 1-2 (October Peak)</span>
                  <div className="text-xl font-extrabold text-slate-900">High Risk (4.8m avg)</div>
                  <p className="text-xs text-slate-600">Northeast Monsoon (Amihan) convergence with tropical disturbance bringing heavy continuous rainfall.</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Weeks 3-4 (Stabilization)</span>
                  <div className="text-xl font-extrabold text-slate-900">Moderate (3.5m avg)</div>
                  <p className="text-xs text-slate-600">Expected rainfall tapering off with episodic localized convective thunderstorms.</p>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Next Month Outlook</span>
                  <div className="text-xl font-extrabold text-slate-900">Normal (2.8m avg)</div>
                  <p className="text-xs text-slate-600">Return to baseline river discharge levels as regional weather patterns normalize.</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-800 text-xs">Key Seasonal Findings:</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Historical telemetry and AI seasonality projections indicate that October and November represent the peak annual flood vulnerability window for the Agusan River basin in Butuan City. Residents in low-lying barangays are advised to maintain flood preparedness kits throughout this quarter.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Powered by AI Hydrological Neural Networks & CDRRMO Butuan</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
