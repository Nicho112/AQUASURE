import React, { useState } from "react";
import { X, AlertTriangle, Send } from "lucide-react";
import { BUTUAN_BARANGAYS } from "../data/butuanSpatialData";

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIncidentAdded: () => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  onIncidentAdded,
}) => {
  const [barangay, setBarangay] = useState(BUTUAN_BARANGAYS[0].name);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [waterLevelMeters, setWaterLevelMeters] = useState("3.5");
  const [severity, setSeverity] = useState<"Critical" | "High" | "Moderate" | "Low">("High");
  const [affectedFamilies, setAffectedFamilies] = useState("250");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const numericWater = parseFloat(waterLevelMeters);
    const numericFamilies = parseInt(affectedFamilies, 10);
    if (isNaN(numericWater) || numericWater < 0 || isNaN(numericFamilies) || numericFamilies < 0) {
      alert("Please enter valid positive numerical values for water level and affected families.");
      setSubmitting(false);
      return;
    }

    const selectedBrgyObj = BUTUAN_BARANGAYS.find((b) => b.name === barangay);
    const coords = selectedBrgyObj ? selectedBrgyObj.coordinates : [8.9475, 125.5456];

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barangay,
          date,
          waterLevelMeters: parseFloat(waterLevelMeters) || 3.0,
          severity,
          affectedFamilies: parseInt(affectedFamilies, 10) || 100,
          description: description || `Reported flood event in ${barangay}`,
          coordinates: coords,
        }),
      });

      if (res.ok) {
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          onIncidentAdded();
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error("Failed to submit incident", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-rose-500/20 rounded-lg text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold">Log Flood Incident / Observation</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="text-lg font-bold text-slate-800">Incident Logged Successfully</h3>
            <p className="text-sm text-slate-500">Record has been added to the database and map.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Barangay Affected
              </label>
              <select
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                {BUTUAN_BARANGAYS.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name} ({b.riskLevel} Risk)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Water Level (Meters)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={waterLevelMeters}
                  onChange={(e) => setWaterLevelMeters(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Affected Families
                </label>
                <input
                  type="number"
                  min="0"
                  value={affectedFamilies}
                  onChange={(e) => setAffectedFamilies(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Description / Observations
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe flood depth, road passability, or rescue status..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? "Saving..." : "Save Incident Record"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
