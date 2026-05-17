import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  // Добавляем хук, который будет следить за изменением URL
  const location = useLocation(); 

  return (
    <div className="wrapper">
      {/* Прокидываем текущий путь в компонент Header через пропс */}
      <Header currentPath={location.pathname} />
      
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;