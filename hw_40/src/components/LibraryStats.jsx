function LibraryStats({books}) {
    const totalCount = books.length;
    const availableCount = books.filter((book) => book.copies > 0).length;

    return (
        <div className="library-stats">
            <p>Всего книг в каталоге: {totalCount}</p>
            <p>Доступны для выдачи: {availableCount}</p>
        </div>
    );
}

export default LibraryStats;