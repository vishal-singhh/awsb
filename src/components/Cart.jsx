export function Cart({ cartItems, subtotal, onQuantityChange, onRemove }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Local State Cart</span>
          <h2>Your cart</h2>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty. Add books from the catalog to continue.</p>
        </div>
      ) : (
        <div className="cart-stack">
          {cartItems.map((item) => (
            <article key={item.id} className="cart-item">
              <div>
                <h3>{item.title}</h3>
                <p>{item.author}</p>
              </div>

              <div className="cart-item-actions">
                <label className="quantity-label">
                  Qty
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={item.quantity}
                    onChange={(event) =>
                      onQuantityChange(item.id, Number(event.target.value))
                    }
                  />
                </label>

                <button
                  type="button"
                  className="text-button"
                  onClick={() => onRemove(item.id)}
                >
                  Remove
                </button>
              </div>

              <strong>${(item.price * item.quantity).toFixed(2)}</strong>
            </article>
          ))}

          <div className="cart-summary">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
        </div>
      )}
    </section>
  );
}
