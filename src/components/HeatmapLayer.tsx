import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
  visible: boolean;
}

export const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ points, visible }) => {
  const map = useMap();

  useEffect(() => {
    if (!visible || !points.length) return;

    let heatLayer: any = null;
    let isMounted = true;

    const tryInit = () => {
      if (!isMounted) return;
      const size = map.getSize();
      if (size.x <= 0 || size.y <= 0) {
        map.invalidateSize();
        requestAnimationFrame(tryInit);
        return;
      }

      try {
        // @ts-ignore
        heatLayer = L.heatLayer(points, {
          radius: 30,
          blur: 18,
          maxZoom: 17,
          max: 1.0,
          gradient: { 0.4: "blue", 0.65: "lime", 0.85: "orange", 1.0: "red" }
        }).addTo(map);
      } catch (e) {
        // Silently catch canvas source height 0 errors if container is still collapsing
      }
    };

    tryInit();

    return () => {
      isMounted = false;
      if (heatLayer) {
        try {
          map.removeLayer(heatLayer);
        } catch (e) {
          // Ignore removal errors
        }
      }
    };
  }, [map, points, visible]);

  return null;
};
