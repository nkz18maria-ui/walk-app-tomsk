import Map from '../components/Map';
import { useNavigate } from 'react-router-dom';

const RoutePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0, 
      padding: 0, 
      overflow: 'hidden', // Чтобы не было случайной прокрутки
      position: 'relative' 
    }}>
      {/* Кнопка "Назад" поверх карты */}
      <button 
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000, // Чтобы кнопка была над картой
          padding: '12px 24px',
          backgroundColor: 'white',
          color: '#4a6a4a',
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        ← Вернуться к настройкам
      </button>

      {/* Сама карта */}
      <div style={{ width: '100%', height: '100%' }}>
        <Map />
      </div>
    </div>
  );
};

export default RoutePage;