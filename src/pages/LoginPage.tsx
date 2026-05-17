import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.post('http://10.114.4.235:8080/api/auth/login', {
                email,
                password
            });
            
            localStorage.setItem('isAuth', 'true');
            
            // Забираем имя из ответа сервера и сохраняем в браузер
            if (response.data && response.data.username) {
                localStorage.setItem('username', response.data.username);
            } else if (response.data && response.data.name) {
                // На случай, если бэкендер назвал поле "name" вместо "username"
                localStorage.setItem('username', response.data.name);
            }

            window.location.href = '/'; 
        } catch (err: any) {
            console.error("Ошибка входа:", err);
            setError(err.response?.data?.message || 'Неверный email или пароль');
        }
    };

    return (
        <div className="main-container">
            <div className="content-wrapper">
                <div className="form-side">
                    <h1>ВХОД</h1>
                    {error && <div style={{ color: '#8b2e2e', marginBottom: '15px', fontWeight: '600' }}>{error}</div>}
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
                                placeholder="не менее 8 символов" 
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