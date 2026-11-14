import AvailabilityBadge from "./AvailabilityBadge.jsx";
import Card from "./Card.jsx";

function BookCard({book}) {
    return (
        <Card>
            <h3>{book.title}</h3>
            <p>Автор: {book.author}</p>
            <p>Год издания: {book.year}</p>
            <p>Жанр: {book.genre}</p>
            <p>Экземпляров: {book.copies}</p>
            <AvailabilityBadge isAvailable={book.copies > 0}/>
            {book.year < 2000 && <p className="premium-label">Классическое издание</p>}
        </Card>
    );
}

export default BookCard;