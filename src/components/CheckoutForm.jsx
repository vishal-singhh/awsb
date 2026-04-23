import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
};

export function CheckoutForm({ cartItems, subtotal, isSubmitting, onSubmit }) {
  const [formValues, setFormValues] = useState(initialForm);
  const [formError, setFormError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!formValues.name.trim()) {
      setFormError("Please enter your name.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formValues.email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }

    await onSubmit({
      name: formValues.name.trim(),
      email: formValues.email.trim().toLowerCase(),
    });
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Checkout</span>
          <h2>Place order</h2>
        </div>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formValues.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Email address
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formValues.email}
            onChange={handleChange}
          />
        </label>

        <div className="summary-card">
          <div className="summary-row">
            <span>Books selected</span>
            <strong>{cartItems.length}</strong>
          </div>
          <div className="summary-row">
            <span>Total quantity</span>
            <strong>{totalQuantity}</strong>
          </div>
          <div className="summary-row">
            <span>Order value</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
        </div>

        {formError ? <p className="inline-error">{formError}</p> : null}

        <button
          type="submit"
          className="primary-button full-width"
          disabled={isSubmitting || cartItems.length === 0}
        >
          {isSubmitting ? "Placing order..." : "Place order"}
        </button>
      </form>
    </section>
  );
}
