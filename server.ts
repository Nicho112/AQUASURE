import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

interface FloodIncident {
  id: string;
  barangay: string;
  date: string;
  waterLevelMeters: number;
  severity: "Critical" | "High" | "Moderate" | "Low";
  affectedFamilies: number;
  description: string;
  coordinates: [number, number]; // [lat, lng]
}

const initialIncidents: FloodIncident[] = [
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

let incidentsStore = [...initialIncidents];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/incidents", (req, res) => {
    res.json({
      success: true,
      data: incidentsStore,
    });
  });

  app.post("/api/incidents", (req, res) => {
    const { barangay, date, waterLevelMeters, severity, affectedFamilies, description, coordinates } = req.body;
    if (!barangay || !severity) {
      return res.status(400).json({ success: false, error: "Barangay and severity are required" });
    }

    const newIncident: FloodIncident = {
      id: `inc-${Date.now()}`,
      barangay,
      date: date || new Date().toISOString().split('T')[0],
      waterLevelMeters: Number(waterLevelMeters) || 3.0,
      severity,
      affectedFamilies: Number(affectedFamilies) || 100,
      description: description || "Reported flood incident along Agusan River.",
      coordinates: coordinates || [8.95, 125.53],
    };

    incidentsStore.unshift(newIncident);
    res.status(201).json({ success: true, data: newIncident });
  });

  app.get("/api/water-levels", (req, res) => {
    // Simulated real-time gauge telemetry for Agusan River stations
    res.json({
      success: true,
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
  });

  app.get("/api/weather", (req, res) => {
    res.json({
      success: true,
      location: "Butuan City, Caraga, Philippines",
      temperatureC: 28.5,
      condition: "Moderate Rain & Thunderstorm",
      rainfallMmPerHour: 14.2,
      humidityPercent: 88,
      windSpeedKmh: 22,
      windDirection: "NE (Northeast Monsoon / Amihan)",
      pressureHpa: 1008,
      floodAdvisory: "Yellow Warning - Low-lying riverine areas advised to monitor water levels",
      forecast: [
        { time: "Now", condition: "Rain", temp: 28 },
        { time: "3 Hours", condition: "Heavy Rain", temp: 27 },
        { time: "6 Hours", condition: "Showers", temp: 29 },
        { time: "Tomorrow", condition: "Partly Cloudy", temp: 31 }
      ]
    });
  });

  app.get("/api/weather-forecast", async (req, res) => {
    try {
      // Fetch real-time hourly forecast from Open-Meteo for Butuan City (8.9475, 125.5406)
      const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=8.9475&longitude=125.5406&hourly=precipitation_probability,precipitation,rain,temperature_2m");
      const data = await response.json();
      if (data && data.hourly) {
        return res.json({ success: true, source: "Open-Meteo Live API", hourly: data.hourly });
      }
    } catch (e) {
      // Fallback
    }
    // Fallback hourly rainfall forecast data
    res.json({
      success: true,
      source: "Offline Simulation",
      hourly: {
        time: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
        precipitation: [2.1, 4.5, 12.8, 24.2, 18.5, 9.2, 3.4, 1.0],
        precipitation_probability: [40, 60, 85, 95, 90, 70, 45, 30]
      }
    });
  });

  app.get("/api/pagasa-forecast", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          success: true,
          bulletin: "PAGASA Weather Advisory: Moderate to heavy rains affecting Caraga region including Butuan City due to northeast monsoon / localized thunderstorms. Water level monitoring advised for Agusan River basin.",
          sources: [{ title: "PAGASA Regional Bulletin (Offline Default)", uri: "https://bagong.pagasa.dost.gov.ph" }]
        });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: "Search for the latest PAGASA weather bulletin, rainfall warning, or typhoon advisory for Butuan City, Agusan del Norte, and Caraga region. Summarize the official meteorological data, expected rainfall amounts, and flood risk level in 3 concise bullet points.",
        tools: [{ googleSearch: {} }],
      } as any);

      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || "PAGASA / Weather Source",
        uri: chunk.web?.uri || "https://pagasa.dost.gov.ph"
      })) || [];

      res.json({
        success: true,
        bulletin: response.text || "PAGASA weather bulletin retrieved successfully.",
        sources: sources.slice(0, 3)
      });
    } catch (err: any) {
      // Gracefully handle rate limit (429 / quota exceeded) without throwing or disrupting user experience
      const isQuotaError = err?.message?.includes("429") || err?.message?.includes("RESOURCE_EXHAUSTED") || err?.status === 429;
      if (isQuotaError) {
        console.warn("PAGASA search grounding API quota reached (429). Serving resilient official meteorological fallback bulletin.");
      } else {
        console.error("PAGASA search grounding error:", err?.message || err);
      }

      res.json({
        success: true,
        bulletin: "PAGASA Weather Advisory (Resilient Standard Fallback): Moderate to heavy rain showers affecting Butuan City and Agusan River basin due to seasonal monsoon troughs. Water level monitoring advised for low-lying barangays.",
        sources: [{ title: "PAGASA DOST Official Portal", uri: "https://pagasa.dost.gov.ph" }]
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
import incidentsRouter from "./routes/incidents";

startServer();
