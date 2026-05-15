import { Link } from 'react-router-dom';
import { useState } from 'react';


// Компонент одной ссылки с эффектами
const NavItem = ({ to, children }: { to: string, children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        gap: '30px',
        textDecoration: 'none',
        display: 'inline-block', // Важно для корректного масштабирования (transform)
        fontSize: '18px',
        fontWeight: '500',
        transition: 'all 0.3s ease', // Плавность для всего (цвета и размера)
        
        // ЦВЕТ: оранжевый при наведении, твой зеленый в покое
        color: isHovered ? '#ff8c00' : '#4a6a4a', 
        
        // РАЗМЕР: увеличиваем на 10% (1.1) при наведении
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      {children}
    </Link>
  );
};

const Header = () => {
  // Просто проверяем наличие ключа в localStorage
  const isAuthenticated = localStorage.getItem('isAuth') === 'true';

  return (
    <header className="site-header">
      <div className="logo">TRIPGEN</div>
      <nav>
        <ul className="nav-links">
          <li><NavItem to="/">Главная</NavItem></li>
          
          {/* Условный рендеринг: сохраняем твои классы и структуру */}
          <li>
            {isAuthenticated ? (
              <NavItem to="/profile">Личный кабинет</NavItem>
            ) : (
              <>
                <NavItem to="/login">Вход</NavItem>
                <span className="slash-separator"> / </span>
                <NavItem to="/register">Регистрация</NavItem>
              </>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;