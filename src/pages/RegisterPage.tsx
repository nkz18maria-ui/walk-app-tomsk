import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('userName', name);
        
        window.location.href = '/'; 
    };

    return (
        <div className="main-container">
            <div className="content-wrapper">
                <div className="form-side">
                    <h1>РЕГИСТРАЦИЯ</h1>
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Имя</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ваше имя"
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
                                placeholder="******" 
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