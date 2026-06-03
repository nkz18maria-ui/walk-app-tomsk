import { useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

interface MoodData {
  id: string;
  label: string;
  icon: string;
}

interface MoodCardsProps {
  activeMoodId: string;
  onSelect: (id: string) => void;
}

const moods: MoodData[] = [
  { id: 'SPOKOINOE',     label: 'Спокойное',     icon: '/images/koala.png' },
  { id: 'ACTIVNOE',      label: 'Активное',      icon: '/images/sword.png' },
  { id: 'IZBRANOE',      label: 'Избранное',      icon: '/images/heart.png' },
  { id: 'POZNAVATELNOE', label: 'Познавательное', icon: '/images/tower.png' },
];

const COLORS = {
  accent: '#4a6a4a',
  activeBg: '#edf3ed',
  textPassive: '#666',
};

const MoodCard = ({
  data,
  isActive,
  onSelect,
  compact,
}: { data: MoodData; isActive: boolean; onSelect: () => void; compact: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: compact ? '14px 10px' : '25px',
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
        transform: (isHovered && !isActive) ? 'translateY(-3px)' : 'none',
      }}
    >
      <div style={{ marginBottom: compact ? '8px' : '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src={data.icon}
          alt={data.label}
          style={{ width: compact ? '44px' : '80px', height: compact ? '44px' : '80px', objectFit: 'contain' }}
        />
      </div>
      <div style={{
        fontSize: compact ? '12px' : '14px',
        fontWeight: isActive ? '600' : '400',
        color: isActive ? COLORS.accent : COLORS.textPassive,
      }}>
        {data.label}
      </div>
    </div>
  );
};

const MoodCards = ({ activeMoodId, onSelect }: MoodCardsProps) => {
  const isMobile = useIsMobile();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: "'Segoe UI', sans-serif" }}>
      <h3 style={{ color: '#4a6a4a', marginBottom: '15px', textAlign: 'left' }}>
        Ваше настроение
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? '10px' : '15px',
      }}>
        {moods.map((mood) => (
          <MoodCard
            key={mood.id}
            data={mood}
            isActive={activeMoodId === mood.id}
            onSelect={() => onSelect(mood.id)}
            compact={isMobile}
          />
        ))}
      </div>
    </div>
  );
};

export default MoodCards;
