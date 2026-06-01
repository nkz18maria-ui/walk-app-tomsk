import { useRef, useState, useCallback } from 'react';
import { Map, Marker } from 'pigeon-maps';

export interface MapPoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  mood?: string;
}

const TOMSK: [number, number] = [56.467, 84.948];

const toWorld = (lat: number, lng: number, zoom: number): [number, number] => {
  const scale = 256 * Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * scale;
  const sin = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale;
  return [x, y];
};

interface MapComponentProps {
  points?: MapPoint[];
}

const MapComponent = ({ points }: MapComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pixel coords stored in state — computed only inside event handlers, never during render
  const [routePixels, setRoutePixels] = useState<[number, number][]>([]);
  const [markerPixels, setMarkerPixels] = useState<[number, number][]>([]);

  const hasRoute = points && points.length >= 2;

  // Called from onBoundsChanged (event handler) — ref access here is allowed
  const recomputePixels = useCallback(
    (center: [number, number], zoom: number) => {
      const el = containerRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();

      const toPixel = (lat: number, lng: number): [number, number] => {
        const [cx, cy] = toWorld(center[0], center[1], zoom);
        const [px, py] = toWorld(lat, lng, zoom);
        return [width / 2 + (px - cx), height / 2 + (py - cy)];
      };

      if (points && points.length >= 2) {
        setRoutePixels([...points, points[0]].map(p => toPixel(p.latitude, p.longitude)));
        setMarkerPixels(points.map(p => toPixel(p.latitude, p.longitude)));
      } else {
        setRoutePixels([]);
        setMarkerPixels([]);
      }
    },
    [points]
  );

  const defaultCenter: [number, number] =
    points && points.length > 0
      ? [
          points.reduce((s, p) => s + p.latitude, 0) / points.length,
          points.reduce((s, p) => s + p.longitude, 0) / points.length,
        ]
      : TOMSK;

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map
        defaultCenter={defaultCenter}
        defaultZoom={points && points.length > 0 ? 14 : 13}
        onBoundsChanged={({ center, zoom }) => recomputePixels(center, zoom)}
      >
        {!hasRoute && <Marker anchor={TOMSK} color="#4a6a4a" />}
      </Map>

      {hasRoute && routePixels.length > 0 && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <polyline
            points={routePixels.map(([x, y]) => `${x},${y}`).join(' ')}
            fill="none"
            stroke="#4a6a4a"
            strokeWidth={3}
            strokeDasharray="10,6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.85}
          />

          {points.map((point, index) => {
            const pixel = markerPixels[index];
            if (!pixel) return null;
            const [x, y] = pixel;
            return (
              <g key={point.id} transform={`translate(${x},${y})`}>
                <circle r={14} fill="#4a6a4a" stroke="white" strokeWidth={2.5} />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={11}
                  fontWeight="bold"
                  fontFamily="'Segoe UI', sans-serif"
                >
                  {index + 1}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
};

export default MapComponent;
