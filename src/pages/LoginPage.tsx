import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Имитируем успешный вход
        localStorage.setItem('isAuth', 'true');
        
        // Перенаправляем на главную. 
        // window.location.href используется, чтобы Header "увидел" изменения в localStorage
        window.location.href = '/'; 
    };

    return (
        <div className="main-container">
            <div className="content-wrapper">
                <div className="form-side">
                    <h1>ВХОД</h1>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@mail.com" 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Пароль</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="******" 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Войти</button>
                    </form>
                    <div className="form-footer">
                        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                    </div>
                </div>
                <div className="image-side" style={{backgroundImage: "url('/images/lake_bg.jpg')"}}></div>
            </div>
        </div>
    );
};

export default LoginPage;