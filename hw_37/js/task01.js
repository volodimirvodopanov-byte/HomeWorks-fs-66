// ===== Точка входа =====
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// ===== Данные студента =====
const pageTitle = "Мой учебный профиль";
const studentName = "John Doe";
const age = 30;
const city = "New York";
const courseName = "Full-Stack Web Development (FS-66)";

// ===== Занятия и вычисления =====
const totalLessons = 110;
const completedLessons = 37;
const remainingLessons = totalLessons - completedLessons;
const progressPercent = Math.round(completedLessons / totalLessons * 100);

// ===== Разметка (JSX) =====
const profile = (
    <div className="profile">
        <h1 className="profile-title">{pageTitle}</h1>

        <div className="row">
            <span className="label">Имя:</span>
            <span className="value">{studentName}</span>
        </div>
        <div className="row">
            <span className="label">Возраст:</span>
            <span className="value">{age}</span>
        </div>
        <div className="row">
            <span className="label">Город:</span>
            <span className="value">{city}</span>
        </div>
        <div className="row">
            <span className="label">Курс:</span>
            <span className="value">{courseName}</span>
        </div>
        <div className="row">
            <span className="label">Пройдено занятий:</span>
            <span className="value">{completedLessons}</span>
        </div>
        <div className="row">
            <span className="label">Осталось занятий:</span>
            <span className="value highlight">{remainingLessons}</span>
        </div>

        <div className="progress">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <p className="progress-text">Пройдено {progressPercent}% курса</p>
    </div>
);

// ===== Вывод на страницу =====
root.render(profile);
