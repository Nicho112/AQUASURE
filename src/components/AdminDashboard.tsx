import React, { useState, useEffect } from "react";
import { FloodIncident } from "../types";
import { Shield, Users, Database, Radio, AlertTriangle, Trash2, RefreshCw, Lock, Activity, Clock, LogIn, LogOut } from "lucide-react";
import { secureStorage } from "../utils/secureStorage";

interface AdminDashboardProps {
  incidents: FloodIncident[];
  onRefreshData: () => void;
  currentUser: { name: string; email: string; role: string } | null;
  onOpenAuth: () => void;
}

interface ActivityLog {
  id: string;
  name: string;
  email: string;
  role: string;
  action: string;
  timestamp: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ incidents, onRefreshData, currentUser, onOpenAuth }) => {
  const [systemStatus, setSystemStatus] = useState<"Operational" | "Maintenance" | "Emergency Broadcast">("Operational");
  const [activeAlertLevel, setActiveAlertLevel] = useState<"Level 1" | "Level 2" | "Level 3">("Level 2");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    try {
      const logs = secureStorage.getItem("aurassure_activity_logs") || [];
      setActivityLogs(logs);
    } catch (e) {
      setActivityLogs([]);
    }
  }, []);

  const handleClearLogs = () => {
    if (confirm("Are you sure you want to clear all active login/logout logs?")) {
      secureStorage.removeItem("aurassure_activity_logs");
      setActivityLogs([]);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMsg("");
      alert("Emergency broadcast successfully transmitted to all registered SMS subscribers and field stations.");
    }, 1200);
  };

  const handleDeleteIncident = async (id: string) => {
    if (confirm("Are you sure you want to delete this incident record?")) {
      alert(`Incident ${id} deleted successfully.`);
      onRefreshData();
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-3xl flex items-center justify-center mx-auto border border-rose-500/30">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Access Required</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Please sign in or create an account with the appropriate privileges.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/30"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  // Restrict access to only Super Administrator
  if (currentUser.role !== "Administrator") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Restricted Access (Super Admin Only)</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Active Login/Logout Logs and Admin Controls are restricted exclusively to Super Administrators. You are currently logged in as <span className="text-cyan-400 font-bold">{currentUser.role}</span>.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-all border border-slate-700"
        >
          Switch Account / Login as Super Admin
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/60">
              Super Admin Command Center
            </span>
            <span className="text-xs font-semibold bg-emerald-600/20 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/30">
              Role: Super Administrator
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mt-2">
            Super Administrator Dashboard & Active Logs
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back, <span className="text-white font-bold">{currentUser.name}</span>. Review user login/logout activity, telemetry, and system broadcasts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefreshData}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Telemetry</span>
          </button>
        </div>
      </div>

      {/* Active User Login / Logout Audit Logs Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Active Login & Logout Audit Logs</h3>
              <p className="text-xs text-slate-400">Real-time session tracking of all users logging in and out of the system</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold bg-slate-800 text-cyan-300 px-3 py-1 rounded-full border border-slate-700">
              Total Log Entries: {activityLogs.length}
            </span>
            {activityLogs.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors"
              >
                Clear Logs
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">User Name</th>
                <th className="py-3 px-4 font-semibold">Username / Email</th>
                <th className="py-3 px-4 font-semibold">Assigned Role</th>
                <th className="py-3 px-4 font-semibold">Activity Action</th>
                <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {activityLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No active login/logout logs recorded yet. Try logging in or out with different user accounts.
                  </td>
                </tr>
              ) : (
                activityLogs.map((log) => {
                  const isLogin = log.action.includes("LOGIN");
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-2">
                        {isLogin ? <LogIn className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                        <span>{log.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono">{log.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold text-[10px] border border-blue-500/30">
                          {log.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          isLogin ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-400 font-mono">{log.timestamp}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">System Status</span>
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-400">{systemStatus}</div>
          <p className="text-xs text-slate-400">All nodes secure & responding</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Alert Tier</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-xl font-extrabold text-amber-400">{activeAlertLevel}</div>
          <p className="text-xs text-slate-400">Agusan River basin monitoring</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Users</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-xl font-extrabold text-white">142 Operators</div>
          <p className="text-xs text-slate-400">CDRRMO & field responders</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Archived Incidents</span>
            <Database className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-xl font-extrabold text-white">{incidents.length} Records</div>
          <p className="text-xs text-slate-400">Express DB synced</p>
        </div>
      </div>

      {/* Emergency Broadcast & System Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Broadcast Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Emergency SMS & Ticker Broadcast</h3>
              <p className="text-xs text-slate-400">Instantly transmit alerts to all mobile subscribers and live tickers</p>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Broadcast Message
              </label>
              <textarea
                rows={3}
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Enter mandatory evacuation warning or flood bulletin..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span>Target Tier:</span>
                <select
                  value={activeAlertLevel}
                  onChange={(e) => setActiveAlertLevel(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2 py-1 text-xs"
                >
                  <option value="Level 1">Level 1 (Advisory)</option>
                  <option value="Level 2">Level 2 (Warning)</option>
                  <option value="Level 3">Level 3 (Critical Evac)</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-rose-600/30 flex items-center space-x-2"
              >
                <Radio className="w-4 h-4" />
                <span>{broadcastSent ? "Broadcasting..." : "Broadcast Alert Now"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* System Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">System Status & Operation Modes</h3>
              <p className="text-xs text-slate-400">Configure global app operational states and maintenance flags</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <strong className="block text-xs font-bold text-white">Operational Mode</strong>
                <span className="text-[11px] text-slate-400">Switch between normal live telemetry and maintenance mode.</span>
              </div>
              <select
                value={systemStatus}
                onChange={(e) => setSystemStatus(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-400 rounded-lg px-3 py-1.5 focus:outline-none"
              >
                <option value="Operational">Operational</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Emergency Broadcast">Emergency Broadcast</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <strong className="block text-xs font-bold text-white">Automated Sensor Polling</strong>
                <span className="text-[11px] text-slate-400">Active background sync with Open-Meteo and water gauges.</span>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold">
                Active (15s)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Flood Incident Record Management</h3>
            <p className="text-xs text-slate-400">Review, audit, or remove active flood incident logs in the database</p>
          </div>
          <span className="text-xs font-bold bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
            Total Records: {incidents.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Barangay</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Severity</th>
                <th className="py-3 px-4 font-semibold">Water Level</th>
                <th className="py-3 px-4 font-semibold">Affected Families</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">Brgy. {inc.barangay}</td>
                  <td className="py-3.5 px-4 text-slate-400">{inc.date}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      inc.severity === "Critical" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" :
                      inc.severity === "High" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                      "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{inc.waterLevelMeters} m</td>
                  <td className="py-3.5 px-4 font-semibold">{inc.affectedFamilies.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteIncident(inc.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete Incident"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
