import { useState } from 'react';

export const WalkingSettings = ({ duration, setDuration, speed, setSpeed }: any) => {
  const [useWeather, setUseWeather] = useState(true);

  
  const speedOptions = [
    { id: 'Медленно', label: 'Медленный', icon: '🐢' },
    { id: 'Средне', label: 'Обычный', icon: '🚶' },
    { id: 'Быстро', label: 'Быстрый', icon: '🐇' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/*  Интерактивный таймлайн */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#333', fontSize: '16px', marginBottom: '20px', fontWeight: '600' }}>Продолжительность</h3>
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
            {Math.floor(duration/60)}ч {duration%60}мин
          </div>

          <input 
            type="range" min="30" max="240" step="15" 
            value={duration} 
            onChange={(e) => setDuration(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#4a6a4a', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', color: '#999', fontSize: '12px' }}>
            <span>30 min</span>
            <span>1h</span>
            <span>2h</span>
            <span>3h</span>
            <span>4h</span>
          </div>
        </div>
      </div>

      {/*  Темп ходьбы с иконками */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#333', fontSize: '16px', marginBottom: '15px', fontWeight: '600' }}>Темп ходьбы</h3>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          {speedOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSpeed(opt.id)}
              style={{
                flex: 1, padding: '15px 10px', borderRadius: '15px', border: '1px solid #f0f0f0', cursor: 'pointer',
                backgroundColor: speed === opt.id ? '#4a6a4a' : '#f9fbf9',
                color: speed === opt.id ? 'white' : '#4a6a4a',
                transition: '0.3s all', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px'
              }}
            >
              <span style={{ fontSize: '24px' }}>{opt.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: '500' }}>{opt.label}</span>
            </button>
          ))}
        </div>

        {/*  Переключатель погоды */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          paddingTop: '15px', borderTop: '1px solid #f0f0f0' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🌧️</span>
            <span style={{ fontSize: '14px', color: '#444' }}>Учитывать погоду</span>
          </div>
          <div 
            onClick={() => setUseWeather(!useWeather)}
            style={{
              width: '50px', height: '26px', backgroundColor: useWeather ? '#4a6a4a' : '#ccc',
              borderRadius: '20px', cursor: 'pointer', position: 'relative', transition: '0.3s'
            }}
          >
            <div style={{
              width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%',
              position: 'absolute', top: '3px', left: useWeather ? '27px' : '3px', transition: '0.3s'
            }} />
          </div>
        </div>
      </div>

    </div>
  );
};