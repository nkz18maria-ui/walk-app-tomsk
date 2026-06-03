import { Link } from 'react-router-dom';
import { useState } from 'react';
import { LogOut, Compass, Menu, X } from 'lucide-react';

const NavItem = ({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '18px',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        color: isHovered ? (to === '#' ? '#e74c3c' : '#ebd58b') : '#4a6a4a',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      {children}
    </Link>
  );
};

const Header = ({ currentPath }: { currentPath: string }) => {
  const isAuthenticated = localStorage.getItem('isAuth') === 'true';
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('isAuth');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div
        className="logo"
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        onClick={() => { window.location.href = '/'; }}
      >
        <Compass size={26} color="#4a6a4a" />
        <span>TRIPGEN</span>
      </div>

      {/* Hamburger button — visible only on mobile via CSS */}
      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Меню"
      >
        {menuOpen ? <X size={24} color="#4a6a4a" /> : <Menu size={24} color="#4a6a4a" />}
      </button>

      <nav className={`site-nav${menuOpen ? ' site-nav--open' : ''}`}>
        <ul className="nav-links" style={{ display: 'flex', alignItems: 'center', listStyle: 'none', gap: '20px', margin: 0, padding: 0 }}>
          <li><NavItem to="/" onClick={closeMenu}>Главная</NavItem></li>

          <li>
            {isAuthenticated ? (
              currentPath === '/profile' ? (
                <NavItem to="#" onClick={(e) => { closeMenu(); handleLogout(e); }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LogOut size={18} />
                    <span>Выйти</span>
                  </div>
                </NavItem>
              ) : (
                <NavItem to="/profile" onClick={closeMenu}>Личный кабинет</NavItem>
              )
            ) : (
              <>
                <NavItem to="/login" onClick={closeMenu}>Вход</NavItem>
                <span className="slash-separator" style={{ color: '#4a6a4a', margin: '0 10px' }}> / </span>
                <NavItem to="/register" onClick={closeMenu}>Регистрация</NavItem>
              </>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
