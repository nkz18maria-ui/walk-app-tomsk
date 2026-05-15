// src/pages/AuthPage.tsx
import { useState } from 'react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Состояние: Вход или Регистрация

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>{isLogin ? 'Вход' : 'Регистрация'}</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="email" placeholder="Email" style={{ padding: '8px' }} />
        <input type="password" placeholder="Пароль" style={{ padding: '8px' }} />
        
        {!isLogin && <input type="password" placeholder="Повторите пароль" style={{ padding: '8px' }} />}
        
        <button style={{ padding: '10px', cursor: 'pointer' }}>
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </div>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'} 
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isLogin ? 'Зарегистрируйтесь' : 'Войдите'}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;