import React, { useState, useEffect } from "react";
import { ActiveTab, FloodIncident, WaterGaugeTelemetry } from "./types";
import { Lock } from "lucide-react";
import { AurassureSidebar } from "./components/Sidebar";
import { AurassureHeader} from "./components/Header";
import { AurassureDashboard } from "./components/Dashboard";
import { MapView } from "./components/MapView";
import { AnalysisDashboard } from "./components/AnalysisDashboard";
import { IncidentsView } from "./components/IncidentsView";
import { AdminDashboard } from "./components/AdminDashboard";
import { ReportIncidentModal } from "./components/ReportIncidentModal";
import { FloodPredictionModal } from "./components/FloodModal";
import { SmsAlertsModal } from "./components/SmsAlertsModal";
import { ShareAlertModal } from "./components/ShareAlertModal";
import { AuthModal } from "./components/AuthModal";
import { secureStorage } from "./utils/secureStorage";
import { BUTUAN_BARANGAYS, EVACUATION_CENTERS } from "./data/butuanSpatialData";
import { motion, AnimatePresence } from "motion/react";

const defaultIncidents: FloodIncident[] = [
  
  {
    id: "inc-1",
    barangay: "Banza",
    date: "2026-01-14",
    waterLevelMeters: 4.8,
    severity: "Critical",
    affectedFamilies: 1250,
    description: "Rapid overflow of Agusan River due to continuous torrential rains in the upper basin.",
    coordinates: [8.973188900448655, 125.53847482718113],
  },
  {
    id: "inc-2",
    barangay: "Dagohoy",
    date: "2025-11-20",
    waterLevelMeters: 3.9,
    severity: "High",
    affectedFamilies: 840,
    description: "Backflow from Agusan River inundated low-lying residential sectors near the wharf.",
    coordinates: [8.953266515979875, 125.5475998520157],
  },
  {
    id: "inc-3",
    barangay: "Baan Riverside Pob. (Bgy. 20)",
    date: "2025-08-12",
    waterLevelMeters: 3.2,
    severity: "Moderate",
    affectedFamilies: 410,
    description: "Flash floods from tributary streams merging into Agusan River main channel.",
    coordinates: [8.953266515979875, 125.5475998520157],
  },
  {
    id: "inc-4",
    barangay: "Lumbocan",
    date: "2024-12-18",
    waterLevelMeters: 4.5,
    severity: "Critical",
    affectedFamilies: 1580,
    description: "Severe riverbank erosion and widespread flooding affecting coastal and riverside communities.",
    coordinates: [9.01095533860901, 125.50833079600021],
  },
  {
    id: "inc-5",
    barangay: "Agusan Pequeño",
    date: "2024-03-05",
    waterLevelMeters: 3.6,
    severity: "High",
    affectedFamilies: 620,
    description: "Ponding and overflow affecting agricultural lands and barangay pathways.",
    coordinates: [8.980644169002325, 125.52200160605024],
  }
];

interface UserProfile {
  name: string;
  email: string;
  role: "Administrator" | "CDRRMO Officer" | "Field Responder" | "Citizen";
  token: string;
}

const SecureAccessGate: React.FC<{ featureName: string; onOpenAuth: () => void }> = ({ featureName, onOpenAuth }) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto border border-teal-200 shadow-sm">
        <Lock className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-slate-900">Protected Security Access</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {featureName} contains restricted disaster response telemetry and logs. You must sign in or create an operator account to access these details.
        </p>
      </div>
      <button
        onClick={onOpenAuth}
        className="px-6 py-3 bg-[#0c515c] hover:bg-[#093f48] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-teal-900/15"
      >
        Sign In / Create Account
      </button>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [incidents, setIncidents] = useState<FloodIncident[]>(defaultIncidents);
  const [telemetry, setTelemetry] = useState<WaterGaugeTelemetry | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return secureStorage.getItem("aurassure_user");
  });

  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fetchData = async () => {
    try {
      const [incRes, telRes] = await Promise.all([
        fetch("/api/incidents").catch(() => null),
        fetch("/api/water-levels").catch(() => null),
      ]);

      if (incRes && incRes.ok) {
        const incData = await incRes.json();
        if (incData.success) {
          setIncidents(incData.data);
        }
      }

      if (telRes && telRes.ok) {
        const telData = await telRes.json();
        if (telData.success) {
          setTelemetry(telData);
        }
      } else {
        setTelemetry({
          station: "Butuan City Hydrological Station (Agusan River)",
          currentLevelMeters: 2.85,
          alertThreshold: 4.00,
          criticalThreshold: 5.00,
          status: "NORMAL",
          lastUpdated: new Date().toISOString(),
          trend: "Stable",
          stations: [
            { name: "Banza Station", level: 2.90, status: "Normal", coords: [8.965, 125.535] },
            { name: "Mandamo Station", level: 2.75, status: "Normal", coords: [8.920, 125.520] },
            { name: "Veruela Upper Basin", level: 4.10, status: "Elevated", coords: [8.120, 125.920] }
          ]
        });
      }
      setTelemetry({
        station: "Butuan City Hydrological Station (Agusan River)",
        currentLevelMeters: 2.85,
        alertThreshold: 4.00,
        criticalThreshold: 5.00,
        status: "NORMAL",
        lastUpdated: new Date().toISOString(),
        trend: "Stable",
        stations: [
          { name: "Banza Station", level: 2.90, status: "Normal", coords: [8.965, 125.535] },
          { name: "Mandamo Station", level: 2.75, status: "Normal", coords: [8.920, 125.520] },
          { name: "Veruela Upper Basin", level: 4.10, status: "Elevated", coords: [8.120, 125.920] }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Background polling service for telemetry every 15s
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        return;
      }
      const key = e.key.toUpperCase();
      if (key === "D") setActiveTab("dashboard");
      else if (key === "M") setActiveTab("map");
      else if (key === "A") setActiveTab("analysis");
      else if (key === "I") setActiveTab("incidents");
      else if (key === "B") setActiveTab("brief");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenSmsModal = () => {
    if (!currentUser) {
      alert("Authentication Required: You must log in or create an account to access SMS Registry details.");
      setIsAuthModalOpen(true);
      return;
    }
    setIsSmsModalOpen(true);
  };

  const handleLogout = () => {
    if (currentUser) {
      try {
        const existingLogs = secureStorage.getItem("aurassure_activity_logs") || [];
        const newLog = {
          id: `log-${Date.now()}`,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          action: "LOGOUT",
          timestamp: new Date().toLocaleString()
        };
        secureStorage.setItem("aurassure_activity_logs", [newLog, ...existingLogs]);
      } catch (e) {}
    }
    secureStorage.removeItem("aurassure_user");
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
      {/* Aurassure Left Sidebar */}
      <AurassureSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={6}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <AurassureHeader
          telemetry={telemetry}
          onOpenSmsModal={handleOpenSmsModal}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Status Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-1.5 flex items-center justify-between text-xs text-slate-600 shadow-xs">
          <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Agusan River Monitoring</span>
          </div>
          <span className="text-teal-700 font-bold">CDRRMO Butuan Live Feed</span>
        </div>

        <main className="flex-1 bg-[#f8fafc] overflow-y-auto">
          {loading ? (
            /* Modern Skeleton-Based Loading State */
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-6 animate-pulse">
              <div className="space-y-2">
              <div className="h-5 bg-slate-200 rounded-md w-32"></div>
                <div className="h-8 bg-slate-200 rounded-lg w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="h-28 bg-slate-200 rounded-2xl"></div>
                <div className="h-28 bg-slate-200 rounded-2xl"></div>
                <div className="h-28 bg-slate-200 rounded-2xl"></div>
                <div className="h-28 bg-slate-200 rounded-2xl"></div>
              </div>
              <div className="h-80 bg-slate-200 rounded-2xl"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === "dashboard" && (
                  <AurassureDashboard
                    incidents={incidents}
                    telemetry={telemetry}
                    setActiveTab={setActiveTab}
                    onOpenPrediction={() => setIsPredictionModalOpen(true)}
                  />
                )}
                {activeTab === "map" && (
                  <MapView
                    incidents={incidents}
                    onOpenPrediction={() => setIsPredictionModalOpen(true)}
                  />
                )}
                {activeTab === "analysis" && (
                  currentUser ? (
                    <AnalysisDashboard incidents={incidents} />
                  ) : (
                    <SecureAccessGate featureName="Analytics & Water Quality Intelligence" onOpenAuth={() => setIsAuthModalOpen(true)} />
                  )
                )}
                {activeTab === "incidents" && (
                  currentUser ? (
                    <IncidentsView
                      incidents={incidents}
                      onOpenReportModal={() => setIsReportModalOpen(true)}
                    />
                  ) : (
                    <SecureAccessGate featureName="Stations & Historical Incident Logs" onOpenAuth={() => setIsAuthModalOpen(true)} />
                  )
                )}
                {activeTab === "admin" && (
                  <AdminDashboard
                    incidents={incidents}
                    onRefreshData={fetchData}
                    currentUser={currentUser}
                    onOpenAuth={() => setIsAuthModalOpen(true)}
                  />
                )}
                
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onIncidentAdded={fetchData}
      />

      <FloodPredictionModal
        isOpen={isPredictionModalOpen}
        onClose={() => setIsPredictionModalOpen(false)}
      />

      <SmsAlertsModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
      />

      <ShareAlertModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
}
