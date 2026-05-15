import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="wrapper">
      <Header />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;