import React, { useEffect, useState } from "react";
import { WeatherTelemetry } from "../types";
import { CloudRain, Wind, Droplets, Thermometer, AlertCircle, CloudLightning } from "lucide-react";

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherTelemetry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWeather(data);
        }
      })
      .catch((err) => console.error("Failed to fetch weather", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !weather) {
    return (
      <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs text-slate-400 flex items-center space-x-2">
        <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <span>Loading weather...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 px-3.5 py-2 rounded-xl text-xs text-white space-y-1 shadow-sm">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2">
          <CloudRain className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-bold text-slate-200">{weather.condition}</span>
        </div>
        <div className="flex items-center space-x-1.5 font-bold text-cyan-300">
          <Thermometer className="w-3.5 h-3.5 text-rose-400" />
          <span>{weather.temperatureC}°C</span>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-[11px] text-slate-300 pt-1 border-t border-slate-700/60">
        <span className="flex items-center space-x-1">
          <Droplets className="w-3 h-3 text-blue-400" />
          <span>{weather.rainfallMmPerHour} mm/hr</span>
        </span>
        <span>•</span>
        <span className="flex items-center space-x-1">
          <Wind className="w-3 h-3 text-emerald-400" />
          <span>{weather.windSpeedKmh} km/h</span>
        </span>
        <span>•</span>
        <span>Hum: {weather.humidityPercent}%</span>
      </div>
    </div>
  );
};
