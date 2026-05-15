import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import RoutePage from './pages/RoutePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Здесь только <Route>! */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="/route" element={<RoutePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;