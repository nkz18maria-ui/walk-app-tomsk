import { useLocation, useNavigate } from 'react-router-dom';
import Map from '../components/Map';
import type { MapPoint } from '../components/Map';
import { Clock, Milestone, MapPin, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

const RoutePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const routeData = location.state?.routeData;

  const points: MapPoint[] = routeData?.points?.map((p: any) => ({
    id: p.id,
    name: p.name,
    latitude: p.latitude,
    longitude: p.longitude,
    mood: p.mood,
  })) ?? [];

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
        padding: '20px 16px 24px',
        maxHeight: '48vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }
    : {
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        padding: '24px',
        width: '300px',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%' }}>
        <Map points={points} />
      </div>

      <div style={panelStyle}>
        {/* Drag handle на мобильном */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: '#ddd' }} />
          </div>
        )}

        {/* Кнопка назад */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: '1px solid #e2ebe2',
            borderRadius: '10px',
            padding: '8px 14px',
            cursor: 'pointer',
            color: '#4a6a4a',
            fontWeight: '600',
            fontSize: '14px',
            alignSelf: 'flex-start',
          }}
        >
          <ArrowLeft size={16} />
          Назад к настройкам
        </button>

        {routeData ? (
          <>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#7a927a', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '6px' }}>
                Маршрут готов
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#2c3e2c', lineHeight: 1.3 }}>
                {routeData.title}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={metricCard}>
                <Milestone size={16} color="#4a6a4a" />
                <div>
                  <div style={metricValue}>{routeData.totalDistance} км</div>
                  <div style={metricLabel}>Расстояние</div>
                </div>
              </div>
              <div style={metricCard}>
                <Clock size={16} color="#4a6a4a" />
                <div>
                  <div style={metricValue}>{routeData.estimatedMinutes} мин</div>
                  <div style={metricLabel}>Время</div>
                </div>
              </div>
            </div>

            {points.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#7a927a', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '10px' }}>
                  Точки маршрута
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {points.map((point, index) => (
                    <div key={point.id} style={pointRow}>
                      <div style={pointBadge}>{index + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e2c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {point.name}
                        </div>
                        {point.mood && (
                          <div style={{ fontSize: '11px', color: '#7a927a', marginTop: '2px' }}>{point.mood}</div>
                        )}
                      </div>
                      <MapPin size={14} color="#7a927a" style={{ flexShrink: 0 }} />
                    </div>
                  ))}
                  <div style={{ ...pointRow, opacity: 0.5 }}>
                    <div style={{ ...pointBadge, backgroundColor: '#e2ebe2', color: '#4a6a4a' }}>↩</div>
                    <div style={{ fontSize: '13px', color: '#7a927a', fontStyle: 'italic' }}>
                      Возврат к старту
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ color: '#7a927a', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
            Данные маршрута не найдены. Вернитесь и сгенерируйте маршрут.
          </div>
        )}
      </div>
    </div>
  );
};

const metricCard: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: '#f4f7f4',
  borderRadius: '12px',
  padding: '12px',
};

const metricValue: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#2c3e2c',
};

const metricLabel: React.CSSProperties = {
  fontSize: '11px',
  color: '#7a927a',
  fontWeight: '500',
};

const pointRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 12px',
  backgroundColor: '#f9fbf9',
  borderRadius: '10px',
  border: '1px solid #e2ebe2',
};

const pointBadge: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: '#4a6a4a',
  color: 'white',
  fontSize: '11px',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

export default RoutePage;
