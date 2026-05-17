import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Milestone, History, Settings, Eye, Trophy
} from 'lucide-react';

// НОВАЯ СВЕТЛАЯ ЭКО-ПАЛИТРА
const LIGHT_THEME = {
  bg: '#f4f7f4',          // Светлый, слегка зеленоватый свежий фон
  cardBg: '#ffffff',      // Чисто белый для карточек
  accent: '#4a6a4a',      // Твой фирменный зеленый цвет для главных элементов
  gold: '#dfb73a',        // Благородное золото для открытых ачивок
  textMain: '#2c3e2c',    // Глубокий темно-зеленый вместо черного (читается мягко)
  textMuted: '#7a927a',   // Приглушенный лесной для подписей
  border: '#e2ebe2',      // Тонкие аккуратные светлые границы
  shadow: '0 4px 20px rgba(74, 106, 74, 0.06)' // Легкая воздушная тень
};

const ProfilePage = () => {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('Загрузка...');
    const [savedRoutes, setSavedRoutes] = useState([]); 
    const [history, setHistory] = useState([]);         
    const [stats, setStats] = useState({ totalKm: 0, locations: 0, level: 1, xp: 10 });

    useEffect(() => {
        const storedName = localStorage.getItem('username');
        if (storedName) {
            setUsername(storedName);
        } else {
            setUsername('Исследователь');
        }
    }, []);

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: LIGHT_THEME.bg, 
            color: LIGHT_THEME.textMain,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", // Более современный шрифт без засечек
            display: 'flex',
            padding: '30px 40px'
        }}>
            
            {/* САЙДБАР (СЛЕВА) */}
            <div style={{
                width: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginRight: '30px',
                borderRight: `1px solid ${LIGHT_THEME.border}`,
                paddingRight: '20px'
            }}>
            </div>

            {/* ОСНОВНОЙ КОНТЕНТ ДАШБОРДА */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '25px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '30px', flex: 1 }}>
                    
                    {/* ЛЕВАЯ КОЛОНКА */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        
                        {/* БЛОК: Personal Info */}
                        <div style={cardStyle}>
                            <div style={cardTitleStyle}></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                                
                                {/* Аватарка в мягком зеленом круге */}
                                <div style={{ position: 'relative', width: '95px', height: '95px' }}>
                                    <div style={avatarRingStyle}></div>
                                    <div style={avatarInsideStyle}>
                                        <User size={45} color={LIGHT_THEME.accent} />
                                    </div>
                                </div>

                                {/* Текстовые метрики */}
                                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                                    <div>
                                        <div style={{ fontSize: '13px', color: LIGHT_THEME.textMuted, marginBottom: '2px', fontWeight: '600' }}>Name</div>
                                        <div style={{ fontSize: '24px', color: LIGHT_THEME.textMain, fontWeight: '700', marginBottom: '15px' }}>{username}</div>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                                            <span style={{ color: LIGHT_THEME.textMuted, fontWeight: '500' }}>Level</span>
                                            <span style={{ color: LIGHT_THEME.accent, fontWeight: '700' }}>{stats.level}</span>
                                        </div>
                                        <div style={xpContainerStyle}>
                                            <div style={{ ...xpfillStyle, width: `${stats.xp}%` }}></div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '18px', paddingLeft: '30px', borderLeft: `1px solid ${LIGHT_THEME.border}` }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={iconBoxStyle}><Milestone size={18} color={LIGHT_THEME.accent} /></div>
                                            <div>
                                                <div style={{ fontSize: '20px', fontWeight: '700', color: LIGHT_THEME.textMain }}>{stats.totalKm} km</div>
                                                <div style={{ fontSize: '11px', color: LIGHT_THEME.textMuted, textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Total Distance</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={iconBoxStyle}><MapPin size={18} color={LIGHT_THEME.accent} /></div>
                                            <div>
                                                <div style={{ fontSize: '20px', fontWeight: '700', color: LIGHT_THEME.textMain }}>{stats.locations}</div>
                                                <div style={{ fontSize: '11px', color: LIGHT_THEME.textMuted, textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Locations visited</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* БЛОК: Favorites */}
                        <div style={cardStyle}>
                            <div style={cardTitleStyle}>Любимое</div>
                            
                            {savedRoutes.length === 0 ? (
                                <div style={emptyStateStyle} onClick={() => navigate('/')}>
                                    <span style={{ color: LIGHT_THEME.accent, fontWeight: '500' }}>+ У вас пока нет избранных маршрутов. Сгенерируйте первый!</span>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                                    {savedRoutes.map((route: any, index) => (
                                        <div key={index} style={{...favCardStyle, backgroundImage: `url(${route.img || '/images/forest_bg.jpg'})`}}>
                                            <div style={favCardOverlayStyle}>
                                                <div style={{ fontSize: '14px', fontWeight: '600' }}>{route.name}</div>
                                                <div style={{ fontSize: '12px', color: LIGHT_THEME.accent }}>{route.distance} km</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* БЛОК: Route History */}
                        <div style={cardStyle}>
                            <div style={cardTitleStyle}>История маршрутов</div>
                            
                            {history.length === 0 ? (
                                <div style={{ color: LIGHT_THEME.textMuted, fontStyle: 'italic', fontSize: '14px', textAlign: 'center', padding: '15px 0' }}>
                                    История прогулок пуста. Исследуйте Томск, чтобы наполнить этот блок!
                                </div>
                            ) : (
                                <div style={scrollHistoryStyle}>
                                    {history.map((item: any, index) => (
                                        <div key={index} style={scrollRowStyle}>
                                            <span style={{ color: LIGHT_THEME.textMuted, fontWeight: '500' }}>{item.date}</span>
                                            <span style={{ color: LIGHT_THEME.textMain, fontWeight: '600' }}>Маршрут: {item.distance} km</span>
                                            <span style={{ color: '#2ecc71', fontWeight: '600' }}>✓ Завершен</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* ПРАВАЯ КОЛОНКА (Achievements) */}
                    <div style={achievementsPanelStyle}>
                        <div style={cardTitleStyle}>Достижения</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                            
                            <div style={stats.totalKm >= 10 ? badgeStyle : badgeLockedStyle}>
                                <div style={{...badgeCircleStyle, borderColor: stats.totalKm >= 10 ? LIGHT_THEME.gold : LIGHT_THEME.border}}>
                                    <Trophy size={24} color={stats.totalKm >= 10 ? LIGHT_THEME.gold : LIGHT_THEME.textMuted} />
                                </div>
                                <span style={badgeLabelStyle}>10k steps</span>
                            </div>

                            <div style={stats.locations > 0 ? badgeStyle : badgeLockedStyle}>
                                <div style={{...badgeCircleStyle, borderColor: stats.locations > 0 ? LIGHT_THEME.gold : LIGHT_THEME.border, fontSize: '24px'}}>
                                    🏛️
                                </div>
                                <span style={badgeLabelStyle}>Tomsk Pioneer</span>
                            </div>

                            <div style={stats.totalKm > 0 ? badgeStyle : badgeLockedStyle}>
                                <div style={{...badgeCircleStyle, borderColor: stats.totalKm > 0 ? LIGHT_THEME.gold : LIGHT_THEME.border, fontSize: '24px'}}>
                                    🌲
                                </div>
                                <span style={badgeLabelStyle}>Forest Scout</span>
                            </div>

                            <div style={badgeLockedStyle}>
                                <div style={{...badgeCircleStyle, borderColor: LIGHT_THEME.border}}>
                                    <Eye size={24} color={LIGHT_THEME.textMuted} />
                                </div>
                                <span style={badgeLabelStyle}>Historical Explorer</span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- СТИЛИ ДЛЯ СВЕТЛОЙ ТЕМЫ ---

const cardStyle: React.CSSProperties = {
    backgroundColor: LIGHT_THEME.cardBg,
    borderRadius: '16px',
    padding: '24px',
    border: `1px solid ${LIGHT_THEME.border}`,
    boxShadow: LIGHT_THEME.shadow
};

const cardTitleStyle: React.CSSProperties = {
    color: LIGHT_THEME.textMuted,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '20px',
    fontWeight: '700'
};

const navIconStyle: React.CSSProperties = { 
    color: LIGHT_THEME.textMuted, 
    cursor: 'pointer', 
    opacity: 0.7,
    transition: 'color 0.2s'
};

const navIconActiveStyle: React.CSSProperties = {
    color: LIGHT_THEME.accent, 
    cursor: 'pointer', 
    backgroundColor: 'rgba(74, 106, 74, 0.08)', 
    padding: '10px', 
    borderRadius: '12px',
    fontWeight: 'bold'
};

const avatarRingStyle: React.CSSProperties = {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    borderRadius: '50%', 
    // Возвращаем благородное золото и добавляем мягкое светящееся облако (тень)
    border: `2px solid ${LIGHT_THEME.gold}`, 
    boxShadow: `0 0 12px rgba(223, 183, 58, 0.4)`, 
    zIndex: 1
};

const avatarInsideStyle: React.CSSProperties = {
    width: '100%', 
    height: '100%', 
    borderRadius: '50%', 
    // Делаем фон внутри кольца чуть светлее, чтобы иконка юзера смотрелась контрастно
    backgroundColor: '#ffffff', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2
};

const energyBadgeStyle: React.CSSProperties = {
    position: 'absolute', bottom: '-2px', left: '50%', transform: 'translateX(-50%)',
    backgroundColor: '#2ecc71', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
};

const xpContainerStyle: React.CSSProperties = { height: '6px', backgroundColor: '#e2ebe2', borderRadius: '3px', overflow: 'hidden' };
const xpfillStyle: React.CSSProperties = { height: '100%', backgroundColor: LIGHT_THEME.accent };

const iconBoxStyle: React.CSSProperties = {
    backgroundColor: 'rgba(74, 106, 74, 0.05)', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const favCardStyle: React.CSSProperties = { height: '140px', borderRadius: '12px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden', border: `1px solid ${LIGHT_THEME.border}` };
const favCardOverlayStyle: React.CSSProperties = { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '12px', borderTop: `1px solid ${LIGHT_THEME.border}` };
const scrollHistoryStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '12px' };

const scrollRowStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', padding: '14px 20px', backgroundColor: '#f9fbf9', borderRadius: '10px', fontSize: '14px', border: `1px solid ${LIGHT_THEME.border}`
};

const achievementsPanelStyle: React.CSSProperties = { ...cardStyle, display: 'flex', flexDirection: 'column' };
const badgeStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' };
const badgeLockedStyle: React.CSSProperties = { ...badgeStyle, opacity: 0.4 };

const badgeCircleStyle: React.CSSProperties = {
    width: '65px', height: '65px', borderRadius: '50%', border: '2px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
};
const badgeLabelStyle: React.CSSProperties = { fontSize: '13px', color: LIGHT_THEME.textMain, fontWeight: '500', maxWidth: '100px', lineHeight: '1.3' };

const emptyStateStyle: React.CSSProperties = {
    border: `2px dashed ${LIGHT_THEME.border}`, borderRadius: '12px', padding: '40px 20px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#fdfdfd', transition: 'background-color 0.2s'
};

export default ProfilePage;