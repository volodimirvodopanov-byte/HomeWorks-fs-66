import BookCard from "./BookCard.jsx";

function BookList({books, genre}) {
    const filteredBooks = genre
        ? books.filter((book) => book.genre === genre)
        : books;

    if (filteredBooks.length === 0) {
        return <p className="empty-message">В выбранной категории книги отсутствуют.</p>
    }

    return (
        <div className="books-list">
            {filteredBooks.map((book) => <BookCard key={book.id} book={book}/>)}
        </div>
    );
}

export default BookList;