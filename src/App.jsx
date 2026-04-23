import { useState } from "react";
import { placeOrder } from "./api/orders";
import { BookCard } from "./components/BookCard";
import { Cart } from "./components/Cart";
import { CheckoutForm } from "./components/CheckoutForm";
import { Navbar } from "./components/Navbar";
import { books } from "./data/books";

const initialStatus = {
  error: "",
  success: null,
  loading: false,
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [status, setStatus] = useState(initialStatus);

  const query = searchTerm.trim().toLowerCase();
  const filteredBooks = !query
    ? books
    : books.filter((book) =>
        [book.title, book.author, book.category].some((value) =>
          value.toLowerCase().includes(query),
        ),
      );

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const addToCart = (book) => {
    setStatus(initialStatus);
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === book.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === book.id
            ? { ...item, quantity: Math.min(item.quantity + 1, 10) }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          cover: book.cover,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (bookId, nextQuantity) => {
    if (nextQuantity <= 0) {
      setCartItems((currentItems) =>
        currentItems.filter((item) => item.id !== bookId),
      );
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === bookId
          ? { ...item, quantity: Math.min(Math.max(nextQuantity, 1), 10) }
          : item,
      ),
    );
  };

  const removeFromCart = (bookId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== bookId),
    );
  };

  const handlePlaceOrder = async ({ name, email }) => {
    if (cartItems.length === 0) {
      setStatus({
        error: "Add at least one book to the cart before placing an order.",
        success: null,
        loading: false,
      });
      return;
    }

    setStatus({
      error: "",
      success: null,
      loading: true,
    });

    try {
      const payload = {
        customerName: name,
        customerEmail: email,
        items: cartItems.map((item) => ({
          bookId: item.id,
          title: item.title,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      };

      const response = await placeOrder(payload);

      setStatus({
        error: "",
        success: response,
        loading: false,
      });
      setCartItems([]);
    } catch (error) {
      setStatus({
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while placing your order.",
        success: null,
        loading: false,
      });
    }
  };

  return (
    <div className="page-shell">
      <Navbar cartCount={cartCount} />

      <main className="container">
        <section className="hero-card">
          <div className="hero-copy">
            <span className="eyebrow">Serverless Book Commerce</span>
            <h1>Discover curated technical reads for modern builders.</h1>
            <p>
              Browse a clean mock catalog, manage a local cart, and place
              serverless orders through AWS API Gateway, Lambda, and DynamoDB.
            </p>
          </div>

          <div className="hero-search">
            <label className="search-label" htmlFor="book-search">
              Search books
            </label>
            <input
              id="book-search"
              type="search"
              className="search-input"
              placeholder="Search by title, author, or category"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <p className="search-meta">
              Showing {filteredBooks.length} of {books.length} books
            </p>
          </div>
        </section>

        {status.success ? (
          <section className="status-panel success-panel" aria-live="polite">
            <h2>Order confirmed</h2>
            <p>
              Your order has been placed successfully. Save the order ID for
              your demo presentation or report.
            </p>
            <div className="confirmation-grid">
              <div>
                <span className="confirmation-label">Order ID</span>
                <strong>{status.success.orderId}</strong>
              </div>
              <div>
                <span className="confirmation-label">Total quantity</span>
                <strong>{status.success.totalQuantity}</strong>
              </div>
              <div>
                <span className="confirmation-label">Total amount</span>
                <strong>${status.success.totalAmount.toFixed(2)}</strong>
              </div>
              <div>
                <span className="confirmation-label">Created at</span>
                <strong>{new Date(status.success.createdAt).toLocaleString()}</strong>
              </div>
            </div>
          </section>
        ) : null}

        {status.error ? (
          <section className="status-panel error-panel" aria-live="polite">
            <h2>Unable to place the order</h2>
            <p>{status.error}</p>
          </section>
        ) : null}

        <section className="content-grid">
          <div className="catalog-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Featured Shelf</span>
                <h2>Available books</h2>
              </div>
              <p className="section-copy">
                Built with reusable React components and client-side filtering
                for a fast academic demo flow.
              </p>
            </div>

            <div className="book-grid">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onAddToCart={() => addToCart(book)}
                />
              ))}
            </div>
          </div>

          <aside className="sidebar">
            <Cart
              cartItems={cartItems}
              subtotal={subtotal}
              onQuantityChange={updateQuantity}
              onRemove={removeFromCart}
            />
            <CheckoutForm
              cartItems={cartItems}
              subtotal={subtotal}
              isSubmitting={status.loading}
              onSubmit={handlePlaceOrder}
            />
          </aside>
        </section>
      </main>
    </div>
  );
}

export default App;
