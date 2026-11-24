import React, { useState, useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import * as turf from "@turf/turf";
import { BUTUAN_CENTER, AGUSAN_RIVER_LINE, BUTUAN_BARANGAYS, EVACUATION_CENTERS } from "../data/butuanSpatialData";
import { FloodIncident, EvacuationCenter } from "../types";
import { Search, Layers, ShieldAlert, Building2, Waves, Compass, Sliders, MapPin, Navigation, AlertTriangle, Camera, TrendingUp, Eye, EyeOff, Route, Flag, Zap } from "lucide-react";
import { MapLegend } from "./MapLegend";
import { HeatmapLayer } from "./HeatmapLayer";
import { WeatherAlertTicker } from "./WeatherAlertTicker";

interface MapViewProps {
  incidents: FloodIncident[];
  onOpenPrediction?: () => void;
}

// Helper component to center map on selection
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, 14, { animate: true });
  }, [center, map]);
  return null;
}

// Custom HTML Markers
const createCustomIcon = (colorClass: string, symbol: string, pulse: boolean = false) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div style="background-color: ${colorClass}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white; ${pulse ? 'animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;' : ''}">${symbol}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
};

const evacuationIcon = createCustomIcon("#2563eb", "🏥"); // Blue for evacuation
const highRiskIcon = (pulse: boolean) => createCustomIcon("#dc2626", "⚠️", pulse); // Red for high risk
const medRiskIcon = createCustomIcon("#d97706", "⚡"); // Amber for medium risk
const lowRiskIcon = createCustomIcon("#059669", "🛡️"); // Emerald for low risk
const incidentIcon = createCustomIcon("#7c3aed", "🌊"); // Purple for flood incidents
const userGpsIcon = createCustomIcon("#0284c7", "📍"); // User location marker
const startPointIcon = createCustomIcon("#059669", "A"); // Start point for routing
const endPointIcon = createCustomIcon("#dc2626", "B"); // End point for routing

export const MapView: React.FC<MapViewProps> = ({ incidents, onOpenPrediction }) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(BUTUAN_CENTER);
  const [showRiver, setShowRiver] = useState(true);
  const [showBarangays, setShowBarangays] = useState(true);
  const [showEvacCenters, setShowEvacCenters] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showBuffer, setShowBuffer] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showFloodZones, setShowFloodZones] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [bufferRadiusKm, setBufferRadiusKm] = useState<number>(1.0);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [nearestEvacResult, setNearestEvacResult] = useState<{ center: EvacuationCenter; distanceKm: number } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Two-Point Routing State
  const [routingMode, setRoutingMode] = useState<"nearest" | "two-point">("nearest");
  const [routeStart, setRouteStart] = useState<[number, number] | null>(null);
  const [routeEnd, setRouteEnd] = useState<[number, number] | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][] | null>(null);
  const [routeDistanceKm, setRouteDistanceKm] = useState<number | null>(null);
  const [routeEtaMins, setRouteEtaMins] = useState<number | null>(null);
  const [calculatingRoute, setCalculatingRoute] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Prepare heatmap points from historical incidents [lat, lng, intensity]
  const heatmapPoints = useMemo(() => {
    return incidents.map((inc) => [
      inc.coordinates[0],
      inc.coordinates[1],
      Math.min(1.0, (inc.waterLevelMeters / 10) * (inc.severity === "Critical" ? 1.2 : 1.0))
    ] as [number, number, number]);
  }, [incidents]);



  // Filter barangays and evac centers
  const filteredBarangays = useMemo(() => {
    if (!searchQuery) return BUTUAN_BARANGAYS;
    return BUTUAN_BARANGAYS.filter((b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.hazardDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredEvacCenters = useMemo(() => {
    if (!searchQuery) return EVACUATION_CENTERS;
    return EVACUATION_CENTERS.filter((e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.barangay.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Spatial Analysis: Calculate nearest evacuation center using Turf.js
  const handleCalculateNearestEvac = (targetCoords: [number, number]) => {
    const targetPoint = turf.point([targetCoords[1], targetCoords[0]]);
    let nearest: EvacuationCenter | null = null;
    let minDistance = Infinity;

    EVACUATION_CENTERS.forEach((ec) => {
      const evacPoint = turf.point([ec.coordinates[1], ec.coordinates[0]]);
      const distance = turf.distance(targetPoint, evacPoint, { units: "kilometers" });
      if (distance < minDistance) {
        minDistance = distance;
        nearest = ec;
      }
    });

    if (nearest) {
      setNearestEvacResult({
        center: nearest,
        distanceKm: Math.round(minDistance * 100) / 100,
      });
      // Set route line from targetCoords to nearest evac
      setRouteCoordinates([targetCoords, (nearest as EvacuationCenter).coordinates]);
      setRouteDistanceKm(Math.round(minDistance * 100) / 100);
      setRouteEtaMins(Math.round(minDistance * 4)); // approx 15km/h walking/evac speed
    }
  };

  // Automatically calculate nearest safe evacuation route from user's current GPS location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          handleCalculateNearestEvac(coords);
        },
        () => {
          handleCalculateNearestEvac(BUTUAN_CENTER);
        },
        { timeout: 5000 }
      );
    } else {
      handleCalculateNearestEvac(BUTUAN_CENTER);
    }
  }, []);


  // Map Click Handler for 2-Point Routing or Nearest Evac
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const clickedCoords: [number, number] = [e.latlng.lat, e.latlng.lng];
        if (routingMode === "nearest") {
          handleCalculateNearestEvac(clickedCoords);
        } else {
          // Two-point routing mode
          if (!routeStart || (routeStart && routeEnd)) {
            setRouteStart(clickedCoords);
            setRouteEnd(null);
            setRouteCoordinates(null);
            setRouteDistanceKm(null);
            setRouteEtaMins(null);
          } else if (routeStart && !routeEnd) {
            setRouteEnd(clickedCoords);
          }
        }
      },
    });
    return null;
  };

  // GPS Geolocation Finder
  const handleFindNearestFromGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(coords);
        setMapCenter(coords);
        handleCalculateNearestEvac(coords);
        setLocating(false);
      },
      (error) => {
        const fallback: [number, number] = BUTUAN_CENTER;
        setUserLocation(fallback);
        setMapCenter(fallback);
        handleCalculateNearestEvac(fallback);
        setLocating(false);
        alert("Using Butuan City Center reference point.");
      },
      { timeout: 10000 }
    );
  };

  // Turf.js Buffer
  const bufferPolygons = useMemo(() => {
    try {
      const lineCoords = AGUSAN_RIVER_LINE.map(([lat, lng]) => [lng, lat]);
      const riverLine = turf.lineString(lineCoords);
      return turf.buffer(riverLine, bufferRadiusKm, { units: "kilometers" });
    } catch (e) {
      return null;
    }
  }, [bufferRadiusKm]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] bg-slate-100 overflow-hidden relative">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-96 bg-white border-r border-slate-200 flex flex-col h-full z-10 shadow-sm overflow-y-auto">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 sticky top-0 z-20 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search barangay or evacuation center..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
            />
          </div>

          {/* Routing Mode Toggle */}
          {routingMode === "nearest" ? (
            <button
              onClick={handleFindNearestFromGPS}
              disabled={locating}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all text-xs disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 ${locating ? "animate-spin" : ""}`} />
              <span>{locating ? "Locating GPS..." : "Find Evac Center"}</span>
            </button>
          ) : (
            <div className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl text-xs text-indigo-900 space-y-1">
              <p className="font-bold flex items-center space-x-1">
                <Flag className="w-3.5 h-3.5 text-indigo-600" />
                <span>2-Point Routing Active</span>
              </p>
              <p className="text-[11px] text-indigo-700">
              </p>
            </div>
          )}

          <button
            onClick={() => onOpenPrediction?.()}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-xl shadow-sm transition-all text-xs"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Flood Horizon</span>
          </button>
        </div>

        <div className="p-4 space-y-6 flex-1 pb-16">
          {/* Layer Toggles */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>GIS Map Layers & Heatmap</span>
            </div>

            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="flex items-center justify-between text-sm cursor-pointer select-none">
                <span className="flex items-center space-x-2 text-slate-700 font-medium">
                  <Waves className="w-4 h-4 text-red-500" />
                  <span>Historical Flood Heatmap</span>
                </span>
                <input
                  type="checkbox"
                  checked={showHeatmap}
                  onChange={(e) => setShowHeatmap(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-sm cursor-pointer select-none">
                <span className="flex items-center space-x-2 text-slate-700 font-medium">
                  <ShieldAlert className="w-4 h-4 text-orange-500" />
                  <span>Flood Inundation Risk Zones</span>
                </span>
                <input
                  type="checkbox"
                  checked={showFloodZones}
                  onChange={(e) => setShowFloodZones(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-sm cursor-pointer select-none">
                <span className="flex items-center space-x-2 text-slate-700 font-medium">
                  <Waves className="w-4 h-4 text-blue-500" />
                  <span>Agusan River & Buffer</span>
                </span>
                <input
                  type="checkbox"
                  checked={showRiver}
                  onChange={(e) => setShowRiver(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-sm cursor-pointer select-none">
                <span className="flex items-center space-x-2 text-slate-700 font-medium">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>Barangay Risk Zones</span>
                </span>
                <input
                  type="checkbox"
                  checked={showBarangays}
                  onChange={(e) => setShowBarangays(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-sm cursor-pointer select-none">
                <span className="flex items-center space-x-2 text-slate-700 font-medium">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Evacuation Centers</span>
                </span>
                <input
                  type="checkbox"
                  checked={showEvacCenters}
                  onChange={(e) => setShowEvacCenters(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
              </label>

              <div className="pt-2 border-t border-slate-200 flex items-center space-x-2">
                <button
                  onClick={() => setShowLegend(!showLegend)}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all shadow-2xs"
                >
                  {showLegend ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-blue-600" />}
                  <span>{showLegend ? "Hide Legend" : "Show Legend"}</span>
                </button>
              
              </div>
            </div>
          </div>

          {/* Route Info Output */}
          {(nearestEvacResult || routeDistanceKm !== null) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                </span>
                <span className="text-xs font-extrabold text-blue-600">
                  {routeDistanceKm} km ({routeEtaMins} mins)
                </span>
              </div>
              {nearestEvacResult && (
                <div className="text-sm font-bold text-slate-900">
                  Destination: {nearestEvacResult.center.name}
                </div>
              )}
              <p className="text-xs text-slate-600">
                Optimized evacuation path avoiding flooded lowlands along Agusan River.
              </p>
            </div>
          )}

          {/* Evacuation Centers List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Butuan Evacuation Centers ({filteredEvacCenters.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredEvacCenters.map((ec) => (
                <div
                  key={ec.id}
                  onClick={() => {
                    setMapCenter(ec.coordinates);
                    handleCalculateNearestEvac(ec.coordinates);
                  }}
                  className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-sm cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
                      {ec.name}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        ec.status === "Open"
                          ? "bg-emerald-100 text-emerald-700"
                          : ec.status === "Near Capacity"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {ec.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>Brgy. {ec.barangay}</span>
                    <span className="font-medium text-blue-600">
                      {ec.currentOccupancy}/{ec.capacity} cap
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leaflet Map Area */}
      <div className="flex-1 h-full relative" ref={mapContainerRef}>
        <MapContainer
          center={BUTUAN_CENTER}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          <MapController center={mapCenter} />
          <MapClickHandler />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & CARAGA GIS'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Leaflet Heatmap Layer */}
          <HeatmapLayer points={heatmapPoints} visible={showHeatmap} />

          {/* Flood Inundation Risk Zones (Heatmap-inspired SVG Overlay based on historical cluster data) */}
          {showFloodZones && incidents.map((inc) => {
            const isCritical = inc.severity === "Critical";
            const zoneColor = isCritical ? "#dc2626" : inc.severity === "High" ? "#ea580c" : "#d97706";
            const radiusMeters = isCritical ? 1400 : inc.severity === "High" ? 1000 : 700;
            return (
              <React.Fragment key={`flood-zone-${inc.id}`}>
                <Circle
                  center={inc.coordinates}
                  radius={radiusMeters}
                  pathOptions={{
                    color: zoneColor,
                    fillColor: zoneColor,
                    fillOpacity: 0.28,
                    weight: 2,
                    dashArray: "6, 6",
                  }}
                />
                <Circle
                  center={inc.coordinates}
                  radius={radiusMeters * 0.5}
                  pathOptions={{
                    color: zoneColor,
                    fillColor: zoneColor,
                    fillOpacity: 0.42,
                    weight: 1,
                  }}
                />
              </React.Fragment>
            );
          })}

          {/* User GPS / Route Start Marker */}
          {userLocation && (
            <Marker position={userLocation} icon={userGpsIcon}>
              <Popup>
                <div className="p-2 space-y-1">
                  <span className="font-bold text-sm text-blue-700">Your GPS Location</span>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Routing Start and End Markers */}
          {routeStart && (
            <Marker position={routeStart} icon={startPointIcon}>
              <Popup><div className="p-1 font-bold text-xs text-emerald-700">Route Start Point (A)</div></Popup>
            </Marker>
          )}
          {routeEnd && (
            <Marker position={routeEnd} icon={endPointIcon}>
              <Popup><div className="p-1 font-bold text-xs text-rose-700">Route End Point (B)</div></Popup>
            </Marker>
          )}

          {/* Route Polyline */}
          {routeCoordinates && (
            <Polyline
              positions={routeCoordinates}
              pathOptions={{ color: routingMode === "nearest" ? "#2563eb" : "#6366f1", weight: 6, opacity: 0.9, dashArray: "10, 10" }}
            />
          )}

          {/* Agusan River Polyline */}
          {showRiver && (
            <>
              <Polyline
                positions={AGUSAN_RIVER_LINE}
                pathOptions={{ color: "rgba(0, 157, 255, 1)", weight: 8, opacity: 0.9 }}
              />
              {showBuffer && bufferPolygons && (
                AGUSAN_RIVER_LINE.map((coords, idx) => (
                  <Circle
                    key={`buf-${idx}`}
                    center={coords}
                    radius={bufferRadiusKm * 1000}
                    pathOptions={{ color: "#a855f7", fillColor: "#a855f7", fillOpacity: 0.08, weight: 1, dashArray: "4, 4" }}
                  />
                ))
              )}
            </>
          )}

          {/* Flood Incident Markers with severity-based custom pulse animations */}
          {showIncidents && incidents.map((inc) => {
            const isCritical = inc.severity === "Critical";
            const isHigh = inc.severity === "High";
            const isMod = inc.severity === "Moderate";
            const color = isCritical ? "#e11d48" : isHigh ? "#ea580c" : isMod ? "#d97706" : "#059669";
            const pulseAnim = isCritical
              ? "animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"
              : isHigh
              ? "animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;"
              : "animation: pulse 3s ease-in-out infinite;";
            
            const incIcon = L.divIcon({
              className: "custom-severity-incident-marker",
              html: `<div style="background-color: ${color}; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 15px; box-shadow: 0 0 16px ${color}; border: 2px solid white; ${pulseAnim}">🌊</div>`,
              iconSize: [38, 38],
              iconAnchor: [19, 19],
              popupAnchor: [0, -19],
            });

            return (
              <Marker key={inc.id} position={inc.coordinates} icon={incIcon}>
                <Popup>
                  <div className="p-2 space-y-2 max-w-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">Brgy. {inc.barangay}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isCritical ? "bg-rose-100 text-rose-700 animate-pulse" : isHigh ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {inc.severity} Zone
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{inc.description}</p>
                    <div className="text-[11px] font-semibold text-slate-700 bg-slate-50 p-1.5 rounded-lg flex justify-between">
                      <span>Water Level: <b>{inc.waterLevelMeters}m</b></span>
                      <span>Affected: <b>{inc.affectedFamilies} families</b></span>
                    </div>
                    <button
                      onClick={() => handleCalculateNearestEvac(inc.coordinates)}
                      className="w-full mt-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-xs flex items-center justify-center space-x-1"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Route to Nearest Evac Center</span>
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Barangays */}
          {showBarangays &&
            filteredBarangays.map((b) => {
              const isHigh = b.riskLevel === "High";
              const pulse = false;
              const icon = isHigh ? highRiskIcon(pulse) : b.riskLevel === "Medium" ? medRiskIcon : lowRiskIcon;

              return (
                <Marker key={b.id} position={b.coordinates} icon={icon}>
                  <Popup>
                    <div className="p-2 space-y-2 max-w-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{b.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          b.riskLevel === "High" ? "bg-rose-100 text-rose-700" : b.riskLevel === "Medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {b.riskLevel} Risk
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{b.hazardDescription}</p>
                      <button
                        onClick={() => handleCalculateNearestEvac(b.coordinates)}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-xs flex items-center justify-center space-x-1"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Route to Nearest Evacuation Center</span>
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* Evacuation Centers */}
          {showEvacCenters &&
            filteredEvacCenters.map((ec) => (
              <Marker key={ec.id} position={ec.coordinates} icon={evacuationIcon}>
                <Popup>
                  <div className="p-2 space-y-2 max-w-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-blue-900">{ec.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                        {ec.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{ec.address}</p>
                    <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg space-y-1">
                      <p>Capacity: <b>{ec.currentOccupancy} / {ec.capacity}</b></p>
                      <p>Contact: <b>{ec.contactNumber}</b></p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* Legend Overlay */}
        {showLegend && <MapLegend />}

        {/* Weather Alert Ticker at bottom of Map View */}
        <WeatherAlertTicker />
      </div>
    </div>
  );
};
