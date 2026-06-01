import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('/api/auth/login', {
                username,
                password
            });

            localStorage.setItem('isAuth', 'true');
            localStorage.setItem('username', username);

            if (response.data?.token) {
                localStorage.setItem('token', response.data.token);
            }

            window.location.href = '/';
        } catch (err: any) {
            console.error("Ошибка входа:", err);
            setError(err.response?.data?.message || 'Неверный логин или пароль');
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
                            <label>Имя пользователя</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ваш username"
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
