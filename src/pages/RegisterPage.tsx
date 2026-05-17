import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const userData = {
            username: username,
            email: email,
            password: password
        };

        try {
            const response = await axios.post('http://10.114.4.235:8080/api/auth/register', userData);
            
            if (response.status === 200 || response.status === 201) {
                localStorage.setItem('isAuth', 'true');
                // Сохраняем имя, которое пользователь только что ввёл в инпут
                localStorage.setItem('username', username); 
                
                window.location.href = '/'; 
            }
        } catch (err: any) {
            console.error("Ошибка регистрации:", err);
            setError(err.response?.data?.message || "Ошибка при создании аккаунта. Проверьте длину пароля (от 8 символов).");
        }
    };
    
    return (
        <div className="main-container">
            <div className="content-wrapper">
                <div className="form-side">
                    <h1>РЕГИСТРАЦИЯ</h1>
                    {error && <div style={{ color: '#8b2e2e', marginBottom: '15px', fontWeight: '600' }}>{error}</div>}
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Имя</label>
                            <input 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                            />
                        </div>
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
                                placeholder="Минимум 8 символов" 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
                    </form>
                    <div className="form-footer">
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </div>
                </div>
                <div className="image-side" style={{backgroundImage: "url('/images/forest_bg.jpg')"}}></div>
            </div>
        </div>
    );
};

export default RegisterPage;