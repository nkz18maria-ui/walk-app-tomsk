import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Map from '../components/Map';
import MoodCards from '../components/MoodCards';
import { WalkingSettings } from '../components/WalkingSettings';

const HomePage = () => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMood, setSelectedMood] = useState('relax');
  const [duration, setDuration] = useState(90);
  const [speed, setSpeed] = useState('Средне'); 
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRouteClick = () => {
    const isAuth = localStorage.getItem('isAuth') === 'true';
    if (!isAuth) {
      navigate('/login');
    } else {
      setShowSettings(!showSettings);
    }
  };

  // Новая функция отправки параметров на бэкенд для генерации
  const handleGenerateRoute = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post('http://localhost:8080/api/routes/generate', {
        mood: selectedMood,
        duration: duration,
        speed: speed
      });

      if (response.data) {
        // Передаем полученный сгенерированный маршрут на страницу /route через state
        navigate('/route', { state: { routeData: response.data } });
      }
    } catch (error) {
      console.error("Ошибка при генерации маршрута бэкендом:", error);
      alert("Не удалось сгенерировать маршрут. Проверьте, запущен ли бэкенд-сервер.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('/images/background.jpg')`, 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '60px', 
      fontFamily: "'Segoe UI', sans-serif" 
    }}>
      
      <div style={{ display: 'flex', gap: '50px', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ flex: 1.2 }}>
          <h1 style={{ fontSize: '70px', fontWeight: 'bold', lineHeight: '1.1', color: '#4a6a4a', margin: '0 0 20px 0' }}>
            Открой город под настроение
          </h1>
          <p style={{ fontSize: '24px', color: '#333', margin: 0 }}>
            Умный алгоритм создаст круговой маршрут для вашей прогулки за считанные секунды.
          </p>
        </div>
        <div style={{ flex: 1, height: '400px', backgroundColor: '#fff', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <Map />
        </div>
      </div>

      <button 
        onClick={handleRouteClick} 
        style={{ 
          padding: '18px 45px', 
          fontSize: '20px', 
          backgroundColor: '#4a6a4a', 
          color: 'white', 
          border: 'none', 
          borderRadius: '15px', 
          cursor: 'pointer', 
          fontWeight: '600'
        }}
      >
        {showSettings ? 'Закрыть настройки' : 'Создать маршрут'}
      </button>

      {showSettings && (
        <div style={{ 
          marginTop: '30px', 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(10px)',
          padding: '40px 60px', 
          borderRadius: '20px', 
          borderTop: '1px solid #e0eee0',
          margin: '30px -60px 0 -60px'
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

            {/* ИСПРАВЛЕНО: Кнопка теперь вызывает handleGenerateRoute и блокируется во время загрузки */}
            <button 
              onClick={handleGenerateRoute}
              disabled={isGenerating}
              style={{ 
                marginTop: '50px', 
                width: '100%', 
                padding: '20px', 
                backgroundColor: isGenerating ? '#ccdccd' : '#4a6a4a', 
                color: 'white', 
                border: 'none', 
                borderRadius: '15px', 
                fontWeight: 'bold', 
                fontSize: '18px',
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