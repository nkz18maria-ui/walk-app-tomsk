const ProfilePage = () => {
    
    // Функция выхода: удаляем флаг авторизации и перенаправляем на главную
    const handleLogout = () => {
        localStorage.removeItem('isAuth'); // Удаляем данные из памяти браузера
        localStorage.removeItem('token');  // На всякий случай чистим и токен
        window.location.href = '/';       // Возвращаемся на главную
    };

    return (
        <div className="main-container">
            <div className="content-wrapper" style={{ padding: '40px' }}>
                <h1 style={{ color: '#4a6a4a' }}>Личный кабинет</h1>
                <p style={{ fontSize: '18px', color: '#666' }}>
                    Добро пожаловать в ваш профиль! Здесь будут отображаться ваши сохраненные маршруты.
                </p>
                
                <button 
                    onClick={handleLogout} 
                    className="btn btn-primary"
                    style={{ 
                        marginTop: '30px', 
                        backgroundColor: '#e74c3c', 
                        border: 'none',
                        padding: '12px 25px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }} 
                >
                    Выйти из аккаунта
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;