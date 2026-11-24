export interface BarangayFeature {
  id: string;
  name: string;
  riskLevel: "High" | "Medium" | "Low";
  population: number;
  households: number;
  coordinates: [number, number]; // [lat, lng]
  polygon?: [number, number][]; // bounding or polygon coords
  hazardDescription: string;
  elevationMeters: number;
}

export interface EvacuationCenter {
  id: string;
  name: string;
  barangay: string;
  address: string;
  capacity: number;
  currentOccupancy: number;
  contactPerson: string;
  contactNumber: string;
  coordinates: [number, number]; // [lat, lng]
  facilities: string[];
  status: "Open" | "Near Capacity" | "Full" | "Standby";
}

export interface FloodIncident {
  id: string;
  barangay: string;
  date: string;
  waterLevelMeters: number;
  severity: "Critical" | "High" | "Moderate" | "Low";
  affectedFamilies: number;
  description: string;
  coordinates: [number, number];
}

export interface IncidentReport {
  reportId: string;
  incidentId: string;
  reporterName: string;
  contactInfo: string;
  reportDate: string;
  additionalNotes: string;
  attachments?: string[]; // URLs or file paths for attachments
}

export interface WaterGaugeTelemetry {
  station: string;
  currentLevelMeters: number;
  alertThreshold: number;
  criticalThreshold: number;
  status: string;
  lastUpdated: string;
  trend: string;
  stations: {
    name: string;
    level: number;
    status: string;
    coords: [number, number];
  }[];
}

export interface WeatherTelemetry {
  location: string;
  temperatureC: number;
  condition: string;
  rainfallMmPerHour: number;
  humidityPercent: number;
  windSpeedKmh: number;
  windDirection: string;
  pressureHpa: number;
  floodAdvisory: string;
  forecast: {
    time: string;
    condition: string;
    temp: number;
  }[];
}


export type ActiveTab = "dashboard" | "map" | "analysis" | "incidents" | "brief" | "admin";
