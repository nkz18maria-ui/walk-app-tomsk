// src/components/Map.tsx
import { Map, Marker } from 'pigeon-maps';

const MapComponent = () => {
  return (
    <div style={{ width: '100%', height: '100%' }} id="map-container">
      <Map 
        defaultCenter={[56.467, 84.948]} // Координаты Томска
        defaultZoom={13}
      >
        {/* Добавление точки (маркера) */}
        <Marker anchor={[56.467, 84.948]} color="red" />
      </Map>
    </div>
  );
};

export default MapComponent;