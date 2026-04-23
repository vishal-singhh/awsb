export function BookCard({ book, onAddToCart }) {
  return (
    <article className="book-card">
      <div className="book-cover" aria-hidden="true">
        {book.cover}
      </div>

      <div className="book-content">
        <div className="book-meta">
          <span className="category-badge">{book.category}</span>
          <span className="rating-badge">{book.rating} / 5</span>
        </div>

        <h3>{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <p className="book-description">{book.description}</p>

        <div className="book-footer">
          <div>
            <strong>${book.price.toFixed(2)}</strong>
            <span>{book.format}</span>
          </div>
          <button type="button" className="primary-button" onClick={onAddToCart}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
