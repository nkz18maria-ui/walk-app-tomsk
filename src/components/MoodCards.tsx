import { useState } from 'react';


interface MoodData {
  id: string;
  label: string;
  icon: string; 
}


const moods: MoodData[] = [
  { id: 'calm', label: 'Спокойное', icon: '/images/koala.png' }, 
  { id: 'active', label: 'Активное', icon: '/images/sword.png' },
  { id: 'romantic', label: 'Избранное', icon: '/images/heart.png' },
  { id: 'study', label: 'Познавательное', icon: '/images/tower.png' },
];


const COLORS = {
  accent: '#4a6a4a', 
  activeBg: '#edf3ed', 
  textPassive: '#666', 
};


const MoodCard = ({ 
  data, 
  isActive, 
  onSelect 
}: { data: MoodData; isActive: boolean; onSelect: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        flex: 1,
        padding: '25px',
        borderRadius: '20px',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        
        border: isActive 
          ? `2px solid ${COLORS.accent}` 
          : (isHovered ? `2px solid #ccc` : `2px solid #e0e0e0`), 
          
       
        backgroundColor: isActive ? COLORS.activeBg : 'white',

        
        boxShadow: isActive || isHovered
          ? '0 10px 20px rgba(0,0,0,0.06)' 
          : '0 5px 10px rgba(0,0,0,0.03)', 
          
        
        transform: (isHovered && !isActive) ? 'translateY(-5px)' : 'none',
      }}
    >
      {/* Иконка */}
<div style={{ 
  marginBottom: '15px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}}>
  <img 
    src={data.icon} 
    alt={data.title} 
    style={{ 
      width: '80px',  // Настрой размер под свой дизайн
      height: '80px', 
      objectFit: 'contain' 
    }} 
  />
</div>

      {/* Текст (Название) */}
      <div style={{
        fontSize: '14px',
        fontWeight: isActive ? '600' : '400',
        color: isActive ? COLORS.accent : COLORS.textPassive, // Меняем цвет при выборе
      }}>
        {data.label}
      </div>
    </div>
  );
};

// 3. Основной компонент для HomePage
const MoodCards = () => {
  // Храним ID активной (выбранной) карточки
  const [activeMoodId, setActiveMoodId] = useState<string>('calm'); // Изначально выбрано "Спокойное"

  return (
    <div style={{
      maxWidth: '1000px', // Ограничиваем ширину блока
      margin: '0 auto',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* Заголовок (в твоем HomePage он уже есть, это пример) */}
      <h3 style={{ 
        color: '#4a6a4a', 
        marginBottom: '15px',
        textAlign: 'left' // Как на твоем HomePage
      }}>
        Ваше настроение
      </h3>

      {/* Контейнер для карточек (Flexbox) */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '15px', // Расстояние между карточками
        alignItems: 'stretch',
        justifyContent: 'space-between',
      }}>
        {moods.map((mood) => (
          <MoodCard 
            key={mood.id} 
            data={mood} 
            isActive={activeMoodId === mood.id} // Проверяем, активна ли эта карточка
            onSelect={() => setActiveMoodId(mood.id)} // При клике ставим ее ID как активный
          />
        ))}
      </div>
    </div>
  );
};

export default MoodCards;