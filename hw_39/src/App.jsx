import {courses} from "./data/courses.js";
import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CourseList from"./components/CourseList.jsx";

function App() {
    const coursesCount = courses.length;                   // ← длина массива courses
    return (
        <div className="app">
            <Header title="Каталог курсов" subtitle="Выберите курс для обучения" />
            <main className="main">
                <h2>Наши курсы</h2>
                <p className="Course-count">
                    Всего курсов: {coursesCount}
                </p>

                <CourseList courses={courses}/>


            </main>

            <Footer/>

        </div>
    );
}

export default App;