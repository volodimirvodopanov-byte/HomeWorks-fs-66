import {books} from "./data/books.js";
import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import BookList from "./components/BookList.jsx";
import LibraryStats from "./components/LibraryStats.jsx";


const genres = [
    "Художественная литература",
    "Учебная литература",
    "Детская литература",
    "Публицистика",
    "Научно-популярная литература"
];


function App() {
    return (
        <div className="app">
            <Header title="Каталог книг" subtitle="Выбрать книгу"/>
            <main className="main">
                <h2>Наши книги</h2>
                <LibraryStats books={books}/>

                <h2>Полный каталог</h2>
                <BookList books={books}/>
                {genres.map((genre) => (
                    <section key={genre}>
                        <h2>{genre}</h2>
                        <BookList books={books} genre={genre}/>
                    </section>
                ))}

            </main>

            <Footer/>

        </div>
    );
}

export default App;