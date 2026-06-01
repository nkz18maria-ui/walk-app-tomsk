import { useRef, useState, useCallback, useMemo } from 'react';
import { Map, Marker } from 'pigeon-maps';

export interface MapPoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  mood?: string;
}

const TOMSK: [number, number] = [56.467, 84.948];

// Web Mercator projection: lat/lng → world pixel coords at given zoom
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
  const [mapState, setMapState] = useState<{ center: [number, number]; zoom: number }>({
    center: TOMSK,
    zoom: 13,
  });

  const toPixel = useCallback(
    (lat: number, lng: number): [number, number] => {
      const el = containerRef.current;
      if (!el) return [0, 0];
      const { width, height } = el.getBoundingClientRect();
      const [cx, cy] = toWorld(mapState.center[0], mapState.center[1], mapState.zoom);
      const [px, py] = toWorld(lat, lng, mapState.zoom);
      return [width / 2 + (px - cx), height / 2 + (py - cy)];
    },
    [mapState]
  );

  const defaultCenter: [number, number] =
    points && points.length > 0
      ? [
          points.reduce((s, p) => s + p.latitude, 0) / points.length,
          points.reduce((s, p) => s + p.longitude, 0) / points.length,
        ]
      : TOMSK;

  const hasRoute = points && points.length >= 2;

  const routePixels = useMemo(
    () => (hasRoute ? [...points, points[0]].map(p => toPixel(p.latitude, p.longitude)) : []),
    [hasRoute, points, toPixel]
  );

  const markerPixels = useMemo(
    () => (hasRoute ? points.map(p => toPixel(p.latitude, p.longitude)) : []),
    [hasRoute, points, toPixel]
  );

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map
        defaultCenter={defaultCenter}
        defaultZoom={points && points.length > 0 ? 14 : 13}
        onBoundsChanged={({ center, zoom }) => setMapState({ center, zoom })}
      >
        {!hasRoute && <Marker anchor={TOMSK} color="#4a6a4a" />}
      </Map>

      {hasRoute && (
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
            const [x, y] = markerPixels[index];
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
