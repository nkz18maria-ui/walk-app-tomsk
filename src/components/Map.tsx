import { useRef, useState, useEffect } from 'react';
import { Map, Marker } from 'pigeon-maps';
import polyline from '@mapbox/polyline';

export interface MapPoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  mood?: string;
}

interface MapComponentProps {
  points?: MapPoint[];
  geometry?: string | null;
}

const TOMSK: [number, number] = [56.467, 84.948];

const toWorld = (lat: number, lng: number, zoom: number): [number, number] => {
  const scale = 256 * Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * scale;
  const sin = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale;
  return [x, y];
};

const MapComponent = ({ points, geometry }: MapComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultCenter: [number, number] =
    points && points.length > 0
      ? [
          points.reduce((s, p) => s + p.latitude, 0) / points.length,
          points.reduce((s, p) => s + p.longitude, 0) / points.length,
        ]
      : TOMSK;

  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [mapZoom, setMapZoom]     = useState(points && points.length > 0 ? 14 : 13);

  const [routePixels,  setRoutePixels]  = useState<[number, number][]>([]);
  const [markerPixels, setMarkerPixels] = useState<[number, number][]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const { width, height } = el.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    const toPixel = (lat: number, lng: number): [number, number] => {
      const [cx, cy] = toWorld(mapCenter[0], mapCenter[1], mapZoom);
      const [px, py] = toWorld(lat, lng, mapZoom);
      return [width / 2 + (px - cx), height / 2 + (py - cy)];
    };

    // Route line: real road geometry from ORS, or straight-line fallback
    if (geometry) {
      const decoded: [number, number][] = polyline.decode(geometry); // [[lat, lng], ...]
      setRoutePixels(decoded.map(([lat, lng]) => toPixel(lat, lng)));
    } else if (points && points.length >= 2) {
      setRoutePixels([...points, points[0]].map(p => toPixel(p.latitude, p.longitude)));
    } else {
      setRoutePixels([]);
    }

    // Numbered markers always from points
    if (points && points.length >= 2) {
      setMarkerPixels(points.map(p => toPixel(p.latitude, p.longitude)));
    } else {
      setMarkerPixels([]);
    }
  }, [points, geometry, mapCenter, mapZoom]);

  const hasRoute = points && points.length >= 2;

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map
        defaultCenter={defaultCenter}
        defaultZoom={points && points.length > 0 ? 14 : 13}
        onBoundsChanged={({ center, zoom }) => {
          setMapCenter(center);
          setMapZoom(zoom);
        }}
      >
        {!hasRoute && <Marker anchor={TOMSK} color="#4a6a4a" />}
      </Map>

      {routePixels.length > 0 && (
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
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.85}
          />

          {markerPixels.map((pixel, index) => {
            if (!pixel || !points?.[index]) return null;
            const [x, y] = pixel;
            return (
              <g key={points[index].id} transform={`translate(${x},${y})`}>
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
