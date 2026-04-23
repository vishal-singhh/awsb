export function Navbar({ cartCount }) {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div>
          <span className="brand-kicker">Cloud-Based Online Bookstore</span>
          <a className="brand-title" href="/">
            CloudLeaf Books
          </a>
        </div>

        <div className="nav-pill" aria-label={`Cart contains ${cartCount} items`}>
          <span className="nav-pill-label">Cart</span>
          <strong>{cartCount}</strong>
        </div>
      </div>
    </header>
  );
}
