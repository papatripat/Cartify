import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
    const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart()

    if (items.length === 0) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state" style={{ minHeight: '60vh' }}>
                        <ShoppingBag size={64} />
                        <h2 style={{ marginTop: 'var(--space-lg)', fontWeight: 700 }}>Your cart is empty</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                            Discover amazing products and add them to your cart
                        </p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Start Shopping <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="page">
            <div className="container cart-page">
                <h1 className="section-title" style={{ marginBottom: 'var(--space-2xl)' }}>
                    Shopping Cart ({totalItems} items)
                </h1>
                <div className="cart-layout">
                    <div className="cart-items">
                        {items.map(item => (
                            <div key={item._id} className="cart-item">
                                <div className="cart-item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="cart-item-details">
                                    <h4 className="cart-item-name">{item.name}</h4>
                                    <span className="cart-item-price">${item.price.toFixed(2)}</span>
                                    <div className="cart-item-quantity">
                                        <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                                            <Minus size={14} />
                                        </button>
                                        <span style={{ width: 32, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                                        <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                    <button className="btn btn-ghost btn-sm" onClick={() => removeFromCart(item._id)} style={{ color: 'var(--error)' }}>
                                        <Trash2 size={16} />
                                    </button>
                                    <span style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span style={{ color: 'var(--success)' }}>Free</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (est.)</span>
                            <span>${(totalPrice * 0.1).toFixed(2)}</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>${(totalPrice * 1.1).toFixed(2)}</span>
                        </div>
                        <Link to="/checkout" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 'var(--space-xl)' }}>
                            Proceed to Checkout
                        </Link>
                        <Link to="/products" className="btn btn-ghost btn-full" style={{ marginTop: 'var(--space-sm)' }}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
