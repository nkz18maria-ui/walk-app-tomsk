import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User, MapPin, Milestone, Eye, Trophy, Plus, X, CheckCircle, Trash2
} from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

const LIGHT_THEME = {
  bg: '#f4f7f4',
  cardBg: '#ffffff',
  accent: '#4a6a4a',
  gold: '#dfb73a',
  textMain: '#2c3e2c',
  textMuted: '#7a927a',
  border: '#e2ebe2',
  shadow: '0 4px 20px rgba(74, 106, 74, 0.06)'
};

const MOOD_OPTIONS = [
    { value: 'SPOKOINOE',     label: 'Спокойное' },
    { value: 'ACTIVNOE',      label: 'Активное' },
    { value: 'IZBRANOE',      label: 'Избранное' },
    { value: 'POZNAVATELNOE', label: 'Познавательное' },
];

interface Point {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    mood: string;
}

const ProfilePage = () => {
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const [username, setUsername] = useState('Загрузка...');
    const [savedRoutes] = useState([]);
    const [history] = useState([]);
    const [stats] = useState({ totalKm: 0, locations: 0, level: 1, xp: 10 });

    const [points, setPoints] = useState<Point[]>([]);
    const [showPointForm, setShowPointForm] = useState(false);
    const [pointForm, setPointForm] = useState({ name: '', description: '', latitude: '', longitude: '', mood: 'SPOKOINOE' });
    const [pointLoading, setPointLoading] = useState(false);
    const [pointError, setPointError] = useState('');
    const [pointSuccess, setPointSuccess] = useState(false);

    const authHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
    });

    const loadPoints = async () => {
        try {
            const res = await axios.get('/api/points', authHeaders());
            setPoints(res.data);
        } catch {
            // не критично при первой загрузке
        }
    };

    useEffect(() => {
        const storedName = localStorage.getItem('username');
        setUsername(storedName || 'Исследователь');
        loadPoints();
    }, []);

    const handleAddPoint = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setPointLoading(true);
        setPointError('');
        setPointSuccess(false);
        try {
            await axios.post('/api/points', {
                name: pointForm.name,
                description: pointForm.description,
                latitude: parseFloat(pointForm.latitude),
                longitude: parseFloat(pointForm.longitude),
                mood: pointForm.mood,
            }, authHeaders());
            setPointSuccess(true);
            setPointForm({ name: '', description: '', latitude: '', longitude: '', mood: 'SPOKOINOE' });
            setShowPointForm(false);
            await loadPoints();
        } catch (err: any) {
            setPointError(err.response?.data?.message || 'Не удалось сохранить точку');
        } finally {
            setPointLoading(false);
        }
    };

    const handleDeletePoint = async (id: number) => {
        try {
            await axios.delete(`/api/points/${id}`, authHeaders());
            setPoints(prev => prev.filter(p => p.id !== id));
        } catch {
            // игнорируем
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: LIGHT_THEME.bg,
            color: LIGHT_THEME.textMain,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            display: 'flex',
            padding: isMobile ? '16px' : '30px 40px',
        }}>

            {/* ОСНОВНОЙ КОНТЕНТ */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.8fr 1fr',
                    gap: isMobile ? '16px' : '30px',
                    flex: 1
                }}>

                    {/* ЛЕВАЯ КОЛОНКА */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '25px' }}>

                        {/* БЛОК: Personal Info */}
                        <div style={cardStyle}>
                            <div style={cardTitleStyle}></div>
                            <div style={{
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                alignItems: isMobile ? 'flex-start' : 'center',
                                gap: isMobile ? '20px' : '40px'
                            }}>
                                <div style={{ position: 'relative', width: '95px', height: '95px', flexShrink: 0 }}>
                                    <div style={avatarRingStyle}></div>
                                    <div style={avatarInsideStyle}>
                                        <User size={45} color={LIGHT_THEME.accent} />
                                    </div>
                                </div>

                                <div style={{
                                    flex: 1,
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
                                    gap: isMobile ? '16px' : '20px',
                                    width: isMobile ? '100%' : undefined
                                }}>
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

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: isMobile ? 'flex-start' : 'center',
                                        gap: isMobile ? '24px' : '18px',
                                        paddingLeft: isMobile ? '0' : '30px',
                                        borderLeft: isMobile ? 'none' : `1px solid ${LIGHT_THEME.border}`,
                                        borderTop: isMobile ? `1px solid ${LIGHT_THEME.border}` : 'none',
                                        paddingTop: isMobile ? '16px' : '0',
                                        flexWrap: 'wrap'
                                    }}>
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
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '15px' }}>
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
                                        <div key={index} style={isMobile ? scrollRowMobileStyle : scrollRowStyle}>
                                            <span style={{ color: LIGHT_THEME.textMuted, fontWeight: '500' }}>{item.date}</span>
                                            <span style={{ color: LIGHT_THEME.textMain, fontWeight: '600' }}>Маршрут: {item.distance} km</span>
                                            <span style={{ color: '#2ecc71', fontWeight: '600' }}>✓ Завершен</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* БЛОК: Мои точки */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={cardTitleStyle}>Мои точки</div>
                                <button
                                    onClick={() => { setShowPointForm(v => !v); setPointError(''); setPointSuccess(false); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                        backgroundColor: showPointForm ? '#f0f0f0' : LIGHT_THEME.accent,
                                        color: showPointForm ? LIGHT_THEME.textMuted : 'white',
                                        fontSize: '13px', fontWeight: '600', transition: 'all 0.2s'
                                    }}
                                >
                                    {showPointForm ? <><X size={14} /> Отмена</> : <><Plus size={14} /> Добавить точку</>}
                                </button>
                            </div>

                            {showPointForm && (
                                <form onSubmit={handleAddPoint} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', padding: '20px', backgroundColor: '#f9fbf9', borderRadius: '12px', border: `1px solid ${LIGHT_THEME.border}` }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={formLabelStyle}>Название</label>
                                            <input
                                                style={formInputStyle}
                                                value={pointForm.name}
                                                onChange={e => setPointForm(f => ({ ...f, name: e.target.value }))}
                                                placeholder="Парк Лагерный сад"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label style={formLabelStyle}>Настроение</label>
                                            <select
                                                style={formInputStyle}
                                                value={pointForm.mood}
                                                onChange={e => setPointForm(f => ({ ...f, mood: e.target.value }))}
                                            >
                                                {MOOD_OPTIONS.map(o => (
                                                    <option key={o.value} value={o.value}>{o.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={formLabelStyle}>Описание</label>
                                        <input
                                            style={formInputStyle}
                                            value={pointForm.description}
                                            onChange={e => setPointForm(f => ({ ...f, description: e.target.value }))}
                                            placeholder="Живописная набережная с видом на реку"
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={formLabelStyle}>Широта</label>
                                            <input
                                                style={formInputStyle}
                                                type="number" step="any"
                                                value={pointForm.latitude}
                                                onChange={e => setPointForm(f => ({ ...f, latitude: e.target.value }))}
                                                placeholder="56.4977"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label style={formLabelStyle}>Долгота</label>
                                            <input
                                                style={formInputStyle}
                                                type="number" step="any"
                                                value={pointForm.longitude}
                                                onChange={e => setPointForm(f => ({ ...f, longitude: e.target.value }))}
                                                placeholder="84.9744"
                                                required
                                            />
                                        </div>
                                    </div>
                                    {pointError && (
                                        <div style={{ color: '#8b2e2e', fontSize: '13px', fontWeight: '600' }}>{pointError}</div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={pointLoading}
                                        style={{
                                            padding: '12px', borderRadius: '10px', border: 'none', cursor: pointLoading ? 'not-allowed' : 'pointer',
                                            backgroundColor: pointLoading ? '#ccdccd' : LIGHT_THEME.accent,
                                            color: 'white', fontWeight: '600', fontSize: '14px'
                                        }}
                                    >
                                        {pointLoading ? 'Сохранение...' : 'Сохранить точку'}
                                    </button>
                                </form>
                            )}

                            {pointSuccess && !showPointForm && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2e7d32', fontSize: '13px', marginBottom: '16px', fontWeight: '600' }}>
                                    <CheckCircle size={16} /> Точка успешно добавлена
                                </div>
                            )}

                            {points.length === 0 ? (
                                <div style={{ color: LIGHT_THEME.textMuted, fontStyle: 'italic', fontSize: '14px', textAlign: 'center', padding: '10px 0' }}>
                                    Нет добавленных точек. Добавьте первую!
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {points.map(point => (
                                        <div key={point.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f9fbf9', borderRadius: '10px', border: `1px solid ${LIGHT_THEME.border}` }}>
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '14px', color: LIGHT_THEME.textMain }}>{point.name}</div>
                                                <div style={{ fontSize: '12px', color: LIGHT_THEME.textMuted, marginTop: '2px' }}>
                                                    {MOOD_OPTIONS.find(o => o.value === point.mood)?.label ?? point.mood} · {point.latitude}, {point.longitude}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeletePoint(point.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* ПРАВАЯ КОЛОНКА (Achievements) */}
                    <div style={achievementsPanelStyle}>
                        <div style={cardTitleStyle}>Достижения</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '16px' : '20px', marginTop: '10px' }}>

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

// --- СТИЛИ ---

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

const avatarRingStyle: React.CSSProperties = {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: '50%',
    border: `2px solid ${LIGHT_THEME.gold}`,
    boxShadow: `0 0 12px rgba(223, 183, 58, 0.4)`,
    zIndex: 1
};

const avatarInsideStyle: React.CSSProperties = {
    width: '100%', height: '100%', borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', zIndex: 2
};

const xpContainerStyle: React.CSSProperties = { height: '6px', backgroundColor: '#e2ebe2', borderRadius: '3px', overflow: 'hidden' };
const xpfillStyle: React.CSSProperties = { height: '100%', backgroundColor: LIGHT_THEME.accent };

const iconBoxStyle: React.CSSProperties = {
    backgroundColor: 'rgba(74, 106, 74, 0.05)', padding: '8px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const favCardStyle: React.CSSProperties = { height: '140px', borderRadius: '12px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden', border: `1px solid ${LIGHT_THEME.border}` };
const favCardOverlayStyle: React.CSSProperties = { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(255,255,255,0.95)', padding: '12px', borderTop: `1px solid ${LIGHT_THEME.border}` };
const scrollHistoryStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '12px' };

const scrollRowStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', padding: '14px 20px',
    backgroundColor: '#f9fbf9', borderRadius: '10px', fontSize: '14px', border: `1px solid ${LIGHT_THEME.border}`
};

const scrollRowMobileStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px 16px',
    backgroundColor: '#f9fbf9', borderRadius: '10px', fontSize: '14px', border: `1px solid ${LIGHT_THEME.border}`
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
    border: `2px dashed ${LIGHT_THEME.border}`, borderRadius: '12px', padding: '40px 20px',
    textAlign: 'center', cursor: 'pointer', backgroundColor: '#fdfdfd', transition: 'background-color 0.2s'
};

const formLabelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: '600', color: LIGHT_THEME.textMuted,
    textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px'
};

const formInputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: `1px solid ${LIGHT_THEME.border}`, fontSize: '14px',
    color: LIGHT_THEME.textMain, backgroundColor: 'white', outline: 'none',
    boxSizing: 'border-box'
};

export default ProfilePage;
