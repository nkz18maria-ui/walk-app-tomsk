import { useIsMobile } from '../hooks/useIsMobile';

export const WalkingSettings = ({ duration, setDuration, speed, setSpeed }: any) => {
  const isMobile = useIsMobile();

  const speedOptions = [
    { id: 'SLOW',   label: 'Медленный', icon: '🐢' },
    { id: 'NORMAL', label: 'Обычный',   icon: '🚶' },
    { id: 'FAST',   label: 'Быстрый',   icon: '🐇' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Продолжительность */}
      <div style={{ backgroundColor: 'white', padding: isMobile ? '18px 16px' : '25px', borderRadius: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#333', fontSize: '16px', marginBottom: '28px', fontWeight: '600' }}>Продолжительность</h3>
        <div style={{ position: 'relative', padding: '0 10px' }}>
          {/* Плашка с текущим временем над ползунком */}
          <div style={{
            position: 'absolute',
            top: '-35px',
            left: `${((duration - 30) / 210) * 100}%`,
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            padding: '4px 12px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#4a6a4a',
            border: '1px solid #eee',
            whiteSpace: 'nowrap'
          }}>
            {Math.floor(duration / 60)}ч {duration % 60}мин
          </div>

          <input
            type="range" min="30" max="240" step="15"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#4a6a4a', cursor: 'pointer' }}
          />
          
        </div>
      </div>

      {/* Темп ходьбы */}
      <div style={{ backgroundColor: 'white', padding: isMobile ? '18px 16px' : '25px', borderRadius: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#333', fontSize: '16px', marginBottom: '15px', fontWeight: '600' }}>Темп ходьбы</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {speedOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSpeed(opt.id)}
              style={{
                flex: 1,
                padding: isMobile ? '12px 6px' : '15px 10px',
                borderRadius: '15px',
                border: '1px solid #f0f0f0',
                cursor: 'pointer',
                backgroundColor: speed === opt.id ? '#4a6a4a' : '#f9fbf9',
                color: speed === opt.id ? 'white' : '#4a6a4a',
                transition: '0.3s all',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span style={{ fontSize: isMobile ? '20px' : '24px' }}>{opt.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: '500' }}>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
