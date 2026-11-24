import React, { useState } from "react";
import { Bell, Smartphone, CheckCircle, X, ShieldAlert, Sparkles, Copy, Check } from "lucide-react";

interface SmsAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmsAlertsModal: React.FC<SmsAlertsModalProps> = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("Banza");
  const [severityLevel, setSeverityLevel] = useState<"Low" | "Moderate" | "High" | "Critical">("High");
  const [customMessage, setCustomMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Automated SMS templates based on flood severity levels
  const templates: Record<string, string> = {
    Low: `[CDRRMO ADVISORY] Agusan River water level in Brgy. ${selectedBarangay} is normal (<3.0m). Conditions are stable. Stay informed via Aurassure GIS.`,
    Moderate: `[CDRRMO WARNING] Agusan River water level in Brgy. ${selectedBarangay} is rising (3.0m - 4.0m). Residents are advised to clear drainage and prepare emergency go-bags.`,
    High: `[CDRRMO HIGH RISK ALERT] Agusan River water level in Brgy. ${selectedBarangay} is elevated (4.0m - 5.0m). Prepare for potential riverbank overflow. Evacuation standby in effect.`,
    Critical: `[CDRRMO MANDATORY EVACUATION] Agusan River in Brgy. ${selectedBarangay} has reached CRITICAL stage (>5.0m)! Immediate mandatory evacuation required. Proceed to nearest designated shelter.`
  };

  const currentTemplate = customMessage || templates[severityLevel];

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(currentTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 7) {
      alert("Please enter a valid mobile number.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubscribed(true);
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sms-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative animate-in zoom-in-95 duration-200 my-auto max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close SMS Alert Registry Modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 id="sms-modal-title" className="text-xl font-extrabold text-slate-900">SMS Alert Generator & Registry</h3>
            <p className="text-xs text-slate-500">Automated CDRRMO mobile broadcast templates & subscription</p>
          </div>
        </div>

        {isSubscribed ? (
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Subscription Confirmed!</h4>
            <p className="text-xs text-slate-600">
              Mobile number <span className="font-bold">{phoneNumber}</span> is now registered for Brgy. {selectedBarangay} automated emergency SMS broadcasts ({severityLevel} severity).
            </p>
            <button
              onClick={() => {
                setIsSubscribed(false);
                setPhoneNumber("");
              }}
              className="mt-3 text-xs font-bold text-blue-600 hover:underline"
            >
              Register Another Number
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-4">
            {/* Automated Alert Generator Section */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Automated Alert Generator</span>
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-semibold">Severity-Based</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {(["Low", "Moderate", "High", "Critical"] as const).map((sev) => (
                  <button
                    type="button"
                    key={sev}
                    onClick={() => {
                      setSeverityLevel(sev);
                      setCustomMessage("");
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      severityLevel === sev && !customMessage
                        ? sev === "Critical" ? "bg-rose-600 text-white shadow-md animate-pulse" :
                          sev === "High" ? "bg-orange-600 text-white shadow-md" :
                          sev === "Moderate" ? "bg-amber-600 text-white shadow-md" :
                          "bg-blue-600 text-white shadow-md"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Generated SMS Template (Editable):</span>
                  <button
                    type="button"
                    onClick={handleCopyTemplate}
                    className="text-cyan-400 hover:underline flex items-center space-x-1 font-semibold"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copied!" : "Copy Template"}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={currentTemplate}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Philippine Mobile Number</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs font-bold text-slate-400">+63</span>
                <input
                  type="tel"
                  placeholder="912 345 6789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-12 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Target Barangay Sector</label>
              <select
                value={selectedBarangay}
                onChange={(e) => setSelectedBarangay(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Banza">Brgy. Banza (High Risk)</option>
                <option value="Dagohoy">Brgy. Dagohoy (Wharf Zone)</option>
                <option value="Maibu">Brgy. Maibu</option>
                <option value="Lumbocan">Brgy. Lumbocan (Estuary)</option>
                <option value="Agusan Pequeño">Brgy. Agusan Pequeño</option>
                <option value="Poblacion">Brgy. Poblacion (City Center)</option>
              </select>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start space-x-2.5 text-xs text-blue-800">
              <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Mock SMS Notification Gateway powered by CDRRMO Butuan telecommunications relay. No spam guarantee.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting to Gateway...</span>
                </>
              ) : (
                <span>Register & Send Broadcast</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
