import React, { useState } from "react";
import { FloodIncident } from "../types";
import { Activity, Plus, Search, ShieldAlert, Droplets, Calendar, Users, MapPin, Download, Printer } from "lucide-react";

interface IncidentsViewProps {
  incidents: FloodIncident[];
  onOpenReportModal: () => void;
}

const incidents: FloodIncident[] = [
  {
    id: "1",
    barangay: "Barangay 1",
    date: "2023-10-01",
    waterLevelMeters: 2.5,
    severity: "High",
    affectedFamilies: 50,
    description: "Flood due to heavy rainfall.",
    coordinates: [8.9475, 125.5432],
  },
];

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  onOpenReportModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("All");

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity =
      severityFilter === "All" || inc.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const totalAffected = incidents.reduce((sum, i) => sum + i.affectedFamilies, 0);
  const maxWaterLevel = incidents.reduce((max, i) => Math.max(max, i.waterLevelMeters), 0);
  const criticalCount = incidents.filter((i) => i.severity === "Critical" || i.severity === "High").length;

  const handleExportCSV = () => {
    const headers = ["ID", "Barangay", "Date", "Severity", "Water Level (m)", "Affected Families", "Description"];
    const rows = filteredIncidents.map(i => [
      i.id,
      `"${i.barangay}"`,
      i.date,
      i.severity,
      i.waterLevelMeters,
      i.affectedFamilies,
      `"${i.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `agusan-flood-incidents-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
const handlePrintPDF = () => {
  // Use the currently filtered incident records
  const data = filteredIncidents;

  if (data.length === 0) {
    alert("No flood incident records available to print.");
    return;
  }

  // Escape HTML to safely display database content
  const escapeHTML = (value: unknown) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => {
      const entities: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entities[char];
    });

  const totalAffected = data.reduce(
    (sum, incident) => sum + Number(incident.affectedFamilies || 0),
    0
  );

  const maxWaterLevel = Math.max(
    ...data.map((incident) => Number(incident.waterLevelMeters || 0))
  );

  const criticalCount = data.filter(
    (incident) =>
      incident.severity === "Critical" ||
      incident.severity === "High"
  ).length;

  const rows = data.map((incident) => `
    <tr>
      <td>${escapeHTML(incident.id)}</td>
      <td>${escapeHTML(incident.barangay)}</td>
      <td>${escapeHTML(incident.date)}</td>
      <td>${escapeHTML(incident.severity)}</td>
      <td>${escapeHTML(incident.waterLevelMeters)} m</td>
      <td>${Number(incident.affectedFamilies || 0).toLocaleString()}</td>
      <td>${escapeHTML(incident.description)}</td>
    </tr>
  `).join("");

  // Open a separate print window
  const printWindow = window.open("", "_blank", "width=1100,height=800");

  if (!printWindow) {
    alert("Please allow pop-ups in your browser to print the report.");
    return;
  }

  const reportDate = new Date().toLocaleDateString();

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Agusan Flood Incident Report</title>

      <style>
        * {
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
          color: #1e293b;
          padding: 30px;
          background: white;
        }

        .header {
          text-align: center;
          border-bottom: 3px solid #1e40af;
          padding-bottom: 20px;
          margin-bottom: 25px;
        }

        .header h1 {
          font-size: 24px;
          margin-bottom: 8px;
          color: #1e3a8a;
        }

        .header p {
          font-size: 12px;
          color: #64748b;
          margin: 5px 0;
        }

        .summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 25px;
        }

        .summary-card {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 15px;
        }

        .summary-card h3 {
          font-size: 11px;
          color: #64748b;
          margin: 0 0 8px;
        }

        .summary-card strong {
          font-size: 21px;
          color: #0f172a;
        }

        h2 {
          font-size: 16px;
          margin-bottom: 12px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }

        thead {
          display: table-header-group;
        }

        th {
          background: #1e3a8a !important;
          color: white !important;
          padding: 12px 8px;
          text-align: left;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        td {
          padding: 10px 8px;
          border: 1px solid #cbd5e1;
          vertical-align: top;
          overflow-wrap: anywhere;
        }

        tr {
          page-break-inside: avoid;
        }

        tbody tr:nth-child(even) {
          background: #f1f5f9 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .footer {
          margin-top: 30px;
          border-top: 1px solid #cbd5e1;
          padding-top: 12px;
          font-size: 10px;
          color: #64748b;
          text-align: center;
        }

        @page {
          size: landscape;
          margin: 12mm;
        }

        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>

    <body>

      <div class="header">
        <h1>AGUSAN FLOOD INCIDENT REPORT</h1>
        <p>Historical Flood Logs and Database</p>
        <p>Agusan River - Butuan City</p>
        <p>Report Generated: ${escapeHTML(reportDate)}</p>
      </div>

      <div class="summary">
        <div class="summary-card">
          <h3>TOTAL RECORDED EVENTS</h3>
          <strong>${data.length}</strong>
        </div>

        <div class="summary-card">
          <h3>PEAK WATER LEVEL</h3>
          <strong>${maxWaterLevel} m</strong>
        </div>

        <div class="summary-card">
          <h3>AFFECTED FAMILIES</h3>
          <strong>${totalAffected.toLocaleString()}</strong>
        </div>

        <div class="summary-card">
          <h3>HIGH RISK / CRITICAL</h3>
          <strong>${criticalCount}</strong>
        </div>
      </div>

      <h2>Flood Incident Records</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Barangay</th>
            <th>Date</th>
            <th>Severity</th>
            <th>Water Level</th>
            <th>Affected Families</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="footer">
        Agusan Flood Monitoring System | Generated ${escapeHTML(reportDate)}
        <br />
        This document contains ${data.length} flood incident record(s).
      </div>

    </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};


  return (
    <div id="incidents-view-print" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Historical Flood Logs & Database</h2>
          <p className="text-sm text-slate-500">
            Persistent database records of Agusan River flood events, water levels, and affected community counts in Butuan City.
          </p>
        </div>
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3.5 py-2.5 rounded-xl shadow-xs transition-all text-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3.5 py-2.5 rounded-xl shadow-xs transition-all text-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF Report</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Flood Event</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Recorded Events</span>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{incidents.length}</div>
          <p className="text-xs text-slate-500">Archived in Express DB</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Peak Water Level</span>
            <Droplets className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{maxWaterLevel} meters</div>
          <p className="text-xs text-slate-500">Recorded at Banza station</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Affected Families</span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalAffected.toLocaleString()}</div>
          <p className="text-xs text-slate-500">Across all recorded episodes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">High Risk / Critical</span>
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{criticalCount} incidents</div>
          <p className="text-xs text-slate-500">Requiring immediate evacuation</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by barangay or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["All", "Critical", "High", "Moderate", "Low"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                severityFilter === sev
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {sev} Risk
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Barangay</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Severity</th>
                <th className="py-3.5 px-6">Water Level</th>
                <th className="py-3.5 px-6">Affected Families</th>
                <th className="py-3.5 px-6">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No historical flood logs match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{inc.barangay}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inc.date}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          inc.severity === "Critical"
                            ? "bg-rose-100 text-rose-700"
                            : inc.severity === "High"
                            ? "bg-orange-100 text-orange-700"
                            : inc.severity === "Moderate"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {inc.waterLevelMeters} m
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {inc.affectedFamilies.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-slate-600 max-w-xs truncate">
                      {inc.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};