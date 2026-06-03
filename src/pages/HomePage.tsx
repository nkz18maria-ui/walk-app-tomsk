import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Map from '../components/Map';
import MoodCards from '../components/MoodCards';
import { WalkingSettings } from '../components/WalkingSettings';
import { useIsMobile } from '../hooks/useIsMobile';

const HomePage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMood, setSelectedMood] = useState('SPOKOINOE');
  const [duration, setDuration] = useState(90);
  const [speed, setSpeed] = useState('NORMAL');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRouteClick = () => {
    const isAuth = localStorage.getItem('isAuth') === 'true';
    if (!isAuth) {
      navigate('/login');
    } else {
      setShowSettings(!showSettings);
    }
  };

  const SPEED_KMH: Record<string, number> = { SLOW: 3, NORMAL: 5, FAST: 7 };

  const getUserLocation = (): Promise<[number, number]> =>
    new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        pos => resolve([pos.coords.latitude, pos.coords.longitude]),
        () => resolve([56.4977, 84.9744])
      );
    });

  const handleGenerateRoute = async () => {
    setIsGenerating(true);
    try {
      const [userLatitude, userLongitude] = await getUserLocation();
      const kmh = SPEED_KMH[speed] ?? 5;
      const desiredDistanceKm = parseFloat(((duration / 60) * kmh).toFixed(2));

      const response = await axios.post(
        '/api/routes/generate',
        { mood: selectedMood, desiredDistanceKm, tempo: speed, userLatitude, userLongitude },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } }
      );

      if (response.data) {
        navigate('/route', { state: { routeData: response.data } });
      }
    } catch (error) {
      console.error("Ошибка при генерации маршрута:", error);
      alert("Не удалось сгенерировать маршрут. Проверьте, запущен ли бэкенд-сервер.");
    } finally {
      setIsGenerating(false);
    }
  };

  const outerPadding = isMobile ? '20px 16px' : '60px';
  const settingsSidePad = isMobile ? '20px' : '60px';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('/images/background.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: isMobile ? 'scroll' : 'fixed',
      padding: outerPadding,
      fontFamily: "'Segoe UI', sans-serif"
    }}>

      {/* Герой: текст + карта */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '24px' : '50px',
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: '32px'
      }}>
        <div style={{ flex: isMobile ? 'unset' : 1.2, width: '100%' }}>
          <h1 style={{
            fontSize: isMobile ? '34px' : '70px',
            fontWeight: 'bold',
            lineHeight: '1.15',
            color: '#4a6a4a',
            margin: '0 0 16px 0'
          }}>
            Открой город под настроение
          </h1>
          <p style={{ fontSize: isMobile ? '16px' : '24px', color: '#333', margin: 0 }}>
            Умный алгоритм создаст круговой маршрут для вашей прогулки за считанные секунды.
          </p>
        </div>

        <div style={{
          flex: isMobile ? 'unset' : 1,
          width: '100%',
          height: isMobile ? '220px' : '400px',
          backgroundColor: '#fff',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <Map />
        </div>
      </div>

      <button
        onClick={handleRouteClick}
        style={{
          padding: isMobile ? '14px 28px' : '18px 45px',
          fontSize: isMobile ? '16px' : '20px',
          backgroundColor: '#4a6a4a',
          color: 'white',
          border: 'none',
          borderRadius: '15px',
          cursor: 'pointer',
          fontWeight: '600',
          width: isMobile ? '100%' : 'auto',
        }}
      >
        {showSettings ? 'Закрыть настройки' : 'Создать маршрут'}
      </button>

      {showSettings && (
        <div style={{
          marginTop: '30px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: `30px ${settingsSidePad}`,
          borderRadius: '20px',
          borderTop: '1px solid #e0eee0',
          ...(isMobile ? {} : { margin: `30px -60px 0 -60px` }),
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <MoodCards activeMoodId={selectedMood} onSelect={setSelectedMood} />
              <WalkingSettings
                duration={duration}
                setDuration={setDuration}
                speed={speed}
                setSpeed={setSpeed}
              />
            </div>

            <button
              onClick={handleGenerateRoute}
              disabled={isGenerating}
              style={{
                marginTop: '40px',
                width: '100%',
                padding: isMobile ? '16px' : '20px',
                backgroundColor: isGenerating ? '#ccdccd' : '#4a6a4a',
                color: 'white',
                border: 'none',
                borderRadius: '15px',
                fontWeight: 'bold',
                fontSize: isMobile ? '16px' : '18px',
                cursor: isGenerating ? 'not-allowed' : 'pointer'
              }}
            >
              {isGenerating ? 'Генерация алгоритмом...' : 'Сгенерировать маршрут →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
